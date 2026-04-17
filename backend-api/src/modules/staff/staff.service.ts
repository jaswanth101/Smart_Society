import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateStaffDto, CreateVendorDto } from './dto/create-staff.dto';
import { AttendanceStatus } from '@prisma/client';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  // ── Staff ────────────────────────────────────────────────

  async createStaff(tenantId: string, dto: CreateStaffDto) {
    return this.prisma.staffMember.create({
      data: { ...dto, tenantId },
    });
  }

  async findAllStaff(tenantId: string) {
    return this.prisma.staffMember.findMany({
      where: { tenantId },
      orderBy: { joinedAt: 'desc' },
    });
  }

  async logAttendance(tenantId: string, staffId: string, status: AttendanceStatus) {
    const today = new Date();
    today.setHours(0,0,0,0); // Normalize to start of day

    return this.prisma.staffAttendance.upsert({
      where: {
        staffId_day: { staffId, day: today }
      },
      update: { status },
      create: {
        staffId,
        day: today,
        status
      }
    });
  }

  // ── Vendors ──────────────────────────────────────────────

  async createVendor(tenantId: string, dto: CreateVendorDto) {
    return this.prisma.vendor.create({
      data: { ...dto, tenantId },
    });
  }

  async findAllVendors(tenantId: string) {
    return this.prisma.vendor.findMany({
      where: { tenantId },
      orderBy: { companyName: 'asc' },
    });
  }
}
