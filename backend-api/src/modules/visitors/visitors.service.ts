import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { VisitStatus } from '@prisma/client';

@Injectable()
export class VisitorsService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, authorUnitId: string | null, dto: CreateVisitorDto) {
    // Basic verification that the unit belongs to the tenant
    const unit = await this.prisma.unit.findUnique({
      where: { id: dto.hostUnitId }
    });

    if (!unit || unit.tenantId !== tenantId) {
      throw new NotFoundException('Host unit not found in this society.');
    }

    // Generate a unique QR code value (in production, use a signed JWT or hash)
    const qrCode = uuidv4();

    return this.prisma.visitor.create({
      data: {
        ...dto,
        tenantId,
        qrCode,
        status: VisitStatus.UPCOMING
      },
    });
  }

  async checkIn(tenantId: string, visitorId: string) {
    const visitor = await this.prisma.visitor.findUnique({
      where: { id: visitorId }
    });

    if (!visitor || visitor.tenantId !== tenantId) {
      throw new NotFoundException('Visitor not found.');
    }

    return this.prisma.visitor.update({
      where: { id: visitorId },
      data: {
        status: VisitStatus.CHECKED_IN,
        checkinAt: new Date()
      }
    });
  }

  async findAll(tenantId: string, filterUnitId?: string) {
    const filter: any = { tenantId };
    if (filterUnitId) filter.hostUnitId = filterUnitId;

    return this.prisma.visitor.findMany({
      where: filter,
      orderBy: { scheduledAt: 'desc' }
    });
  }
}
