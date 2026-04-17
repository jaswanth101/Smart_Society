import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateRfidDto, CreateGateLogDto } from './dto/create-access.dto';

@Injectable()
export class AccessControlService {
  constructor(private prisma: PrismaService) {}

  async assignRfid(tenantId: string, dto: CreateRfidDto) {
    const existing = await this.prisma.rfidCard.findUnique({
      where: { uid: dto.uid }
    });

    if (existing) {
      throw new ConflictException('RFID card with this UID is already assigned.');
    }

    return this.prisma.rfidCard.create({
      data: { ...dto, tenantId }
    });
  }

  async findAllRfids(tenantId: string) {
    return this.prisma.rfidCard.findMany({
      where: { tenantId },
      orderBy: { issuedAt: 'desc' }
    });
  }

  async logGateAction(tenantId: string, dto: CreateGateLogDto) {
    return this.prisma.gateLog.create({
      data: {
        ...dto,
        actor: dto.actor || 'SYSTEM',
        tenantId
      }
    });
  }

  async fetchGateLogs(tenantId: string, limit: number = 50) {
    return this.prisma.gateLog.findMany({
      where: { tenantId },
      orderBy: { timestamp: 'desc' },
      take: limit
    });
  }
}
