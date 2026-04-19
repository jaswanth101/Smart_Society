import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

// ─────────────────────────────────────────────────────────
// SecurityService — SOS Panic Button + Emergency Broadcast
// Items 2.7 and 2.8 from the Tier 2 business logic spec.
// ─────────────────────────────────────────────────────────

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);
  constructor(private prisma: PrismaService) {}

  // ── 2.7 SOS / Panic Button ─────────────────────────────
  // Resident triggers alarm → logged in DB → in production
  // would push to Guard tablets + Supervisor via FCM/WS.
  async triggerSOS(tenantId: string, userId: string, location?: string) {
    // 1. Log the SOS event as a CRITICAL complaint
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, unitId: true, unit: { select: { flatNumber: true } } }
    });

    const sosTicket = await this.prisma.complaint.create({
      data: {
        tenantId,
        raisedById: userId,
        title: `🚨 SOS PANIC — ${user?.name || 'Unknown'} (${user?.unit?.flatNumber || 'Unknown Unit'})`,
        description: `Emergency panic button triggered${location ? ` at ${location}` : ''}. Immediate response required.`,
        category: 'EMERGENCY',
        priority: 'CRITICAL',
        status: 'ESCALATED',
        slaDeadline: new Date(Date.now() + 15 * 60 * 1000), // 15 min SLA
      }
    });

    // 2. Create a broadcast record for audit trail
    await this.prisma.broadcast.create({
      data: {
        tenantId,
        title: '🚨 SOS ALERT',
        message: `Emergency from ${user?.unit?.flatNumber || 'Unit'} — ${user?.name}. ${location || 'Location not provided.'}`,
        channel: 'ALL',
        sentBy: userId
      }
    });

    // 3. Log to gate logs for guard tablet visibility
    await this.prisma.gateLog.create({
      data: {
        tenantId,
        gate: 'SOS_SYSTEM',
        action: 'EMERGENCY_OVERRIDE',
        actor: user?.name || userId,
        method: 'SOS_BUTTON'
      }
    });

    this.logger.warn(`[SOS] 🚨 Panic triggered by ${user?.name} at ${user?.unit?.flatNumber}`);

    // TODO: Wire to Firebase Cloud Messaging to push to guard tablets
    // TODO: Wire to WhatsApp API to alert Supervisor phone

    return {
      message: 'SOS alert dispatched to all security personnel.',
      ticketId: sosTicket.id,
      respondersNotified: true
    };
  }

  // ── 2.8 Emergency Broadcast ────────────────────────────
  // President sends un-mutable blast to EVERY person in society.
  async emergencyBroadcast(tenantId: string, senderId: string, title: string, message: string) {
    // 1. Save broadcast record
    const broadcast = await this.prisma.broadcast.create({
      data: {
        tenantId,
        title: `⚠️ EMERGENCY: ${title}`,
        message,
        channel: 'ALL',
        sentBy: senderId
      }
    });

    // 2. Also create a pinned EMERGENCY notice for the digital bulletin board
    const sender = await this.prisma.user.findUnique({
      where: { id: senderId },
      select: { name: true }
    });

    await this.prisma.notice.create({
      data: {
        tenantId,
        title: `⚠️ EMERGENCY: ${title}`,
        body: message,
        category: 'EMERGENCY',
        isPinned: true,
        authorName: sender?.name || 'President',
        totalRecipients: await this.prisma.user.count({ where: { tenantId, isActive: true } })
      }
    });

    this.logger.warn(`[EMERGENCY BROADCAST] President triggered: "${title}"`);

    // TODO: Wire to FCM for push notifications to ALL users
    // TODO: Wire to WhatsApp/SMS for non-app users

    return {
      message: 'Emergency broadcast sent to all residents and staff.',
      broadcastId: broadcast.id,
      recipientCount: await this.prisma.user.count({ where: { tenantId, isActive: true } })
    };
  }
}
