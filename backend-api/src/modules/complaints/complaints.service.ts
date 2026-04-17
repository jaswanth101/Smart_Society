import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateComplaintDto, UpdateComplaintStatusDto } from './dto/create-complaint.dto';

@Injectable()
export class ComplaintsService {
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
}
