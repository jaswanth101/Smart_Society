import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateComplaintDto, UpdateComplaintStatusDto } from './dto/create-complaint.dto';

@Injectable()
export class ComplaintsService {
  private readonly logger = new Logger(ComplaintsService.name);
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, raisedById: string, dto: CreateComplaintDto) {
    return this.prisma.complaint.create({
      data: {
        ...dto,
        tenantId,
        raisedById
      }
    });
  }

  async updateStatus(tenantId: string, complaintId: string, dto: UpdateComplaintStatusDto) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id: complaintId }
    });

    if (!complaint || complaint.tenantId !== tenantId) {
      throw new NotFoundException('Complaint not found');
    }

    return this.prisma.complaint.update({
      where: { id: complaintId },
      data: {
        status: dto.status,
        assignedToId: dto.assignedToId || undefined
      }
    });
  }

  async findAll(tenantId: string, userId: string, role: string) {
    // If user is a resident, they only see their own complaints
    // If user is staff/admin, they see complaints assigned to them or all complaints
    const isAdmin = ['SUPER_ADMIN', 'PRESIDENT', 'SECRETARY', 'SUPERVISOR'].includes(role);
    
    const filter: any = { tenantId };

    if (!isAdmin) {
      filter.raisedById = userId; 
    }

    return this.prisma.complaint.findMany({
      where: filter,
      include: {
        raisedBy: { select: { name: true, phone: true } },
        assignedTo: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // ━━━━━━━━━━━━━ TIER 2: Business Logic ━━━━━━━━━━━━━

  // 2.11 — SLA Auto-Escalation CRON
  // Runs every hour. If a ticket has breached its SLA deadline, auto-escalate it.
  @Cron(CronExpression.EVERY_HOUR)
  async escalateBreachedTickets() {
    this.logger.log('[CRON] Checking for SLA breaches...');
    const now = new Date();

    const breached = await this.prisma.complaint.updateMany({
      where: {
        status: { in: ['PENDING', 'ASSIGNED', 'IN_PROGRESS'] },
        slaDeadline: { lt: now }
      },
      data: { status: 'ESCALATED' }
    });

    if (breached.count > 0) {
      this.logger.warn(`[CRON] Auto-escalated ${breached.count} tickets that breached SLA.`);
    }
  }

  // 2.12 — Rate staff after complaint resolution
  async rateStaff(tenantId: string, complaintId: string, rating: number) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id: complaintId }
    });

    if (!complaint || complaint.tenantId !== tenantId) {
      throw new NotFoundException('Complaint not found.');
    }

    if (!complaint.assignedToId) {
      throw new NotFoundException('No staff was assigned to this ticket.');
    }

    // Find the staff member linked to this user
    const staff = await this.prisma.staffMember.findFirst({
      where: { tenantId }
    });

    if (staff) {
      // Update running average: newRating = (oldRating + newRating) / 2
      const newRating = staff.rating > 0 ? (staff.rating + rating) / 2 : rating;

      await this.prisma.staffMember.update({
        where: { id: staff.id },
        data: { rating: Math.round(newRating * 10) / 10 }
      });
    }

    return { message: `Rating of ${rating}/5 recorded. Thank you!` };
  }
}
