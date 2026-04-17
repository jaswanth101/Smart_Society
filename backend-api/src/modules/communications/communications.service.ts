import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateNoticeDto, CreateBroadcastDto } from './dto/create-comms.dto';

@Injectable()
export class CommunicationsService {
  constructor(private prisma: PrismaService) {}

  // ── Notices (Digital Bulletin Board) ─────────────────────

  async createNotice(tenantId: string, authorId: string, dto: CreateNoticeDto) {
    return this.prisma.notice.create({
      data: {
        ...dto,
        tenantId,
        authorId
      }
    });
  }

  async findAllNotices(tenantId: string) {
    return this.prisma.notice.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { name: true, role: true } }
      }
    });
  }

  // ── Broadcasts (Push Notifications / SMS) ────────────────

  async dispatchBroadcast(tenantId: string, senderId: string, dto: CreateBroadcastDto) {
    // MVP: Stub the external API out. We just log it successfully to the database.
    // In production, you would grab all User pushTokens for this tenantId and send them to Firebase/Twilio here.

    return this.prisma.broadcast.create({
      data: {
        ...dto,
        tenantId,
        senderId,
        successCount: 1 // Stub metric
      }
    });
  }

  async fetchBroadcastHistory(tenantId: string) {
    return this.prisma.broadcast.findMany({
      where: { tenantId },
      orderBy: { sentAt: 'desc' },
      include: {
        sender: { select: { name: true } }
      }
    });
  }
}
