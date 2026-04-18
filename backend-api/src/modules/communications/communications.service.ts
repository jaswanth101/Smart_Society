import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateNoticeDto, CreateBroadcastDto } from './dto/create-comms.dto';

@Injectable()
export class CommunicationsService {
  constructor(private prisma: PrismaService) {}

  // ── Notices (Digital Bulletin Board) ─────────────────────

  async createNotice(tenantId: string, authorId: string, dto: CreateNoticeDto) {
    // Map DTO 'content' to Prisma 'body'
    const { content, ...restProps } = dto as any;
    
    return this.prisma.notice.create({
      data: {
        ...restProps,
        body: content,
        tenantId,
        authorName: authorId 
      }
    });
  }

  async findAllNotices(tenantId: string) {
    return this.prisma.notice.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Broadcasts (Push Notifications / SMS) ────────────────

  async dispatchBroadcast(tenantId: string, senderId: string, dto: CreateBroadcastDto) {
    // Map DTO 'body' to Prisma 'message'
    const { body, ...restProps } = dto as any;

    return this.prisma.broadcast.create({
      data: {
        ...restProps,
        message: body,
        tenantId,
        sentBy: senderId,
      }
    });
  }

  async fetchBroadcastHistory(tenantId: string) {
    return this.prisma.broadcast.findMany({
      where: { tenantId },
      orderBy: { sentAt: 'desc' },
    });
  }
}
