import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateStaffDto, CreateVendorDto } from './dto/create-staff.dto';
import { CreateTaskDto } from './dto/task.dto';
import { AttendanceStatus, TaskStatus } from '@prisma/client';

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

  // ── Tasks ────────────────────────────────────────────────

  async createTask(tenantId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        zone: dto.zone,
        priority: dto.priority,
        staffId: dto.staffId,
        dueBy: dto.dueBy ? new Date(dto.dueBy) : null,
        tenantId,
        status: dto.staffId ? 'IN_PROGRESS' : 'PENDING',
      },
      include: {
        staff: { select: { id: true, name: true, role: true } },
      },
    });
  }

  async findAllTasks(tenantId: string) {
    return this.prisma.task.findMany({
      where: { tenantId },
      include: {
        staff: { select: { id: true, name: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateTaskStatus(tenantId: string, id: string, status: TaskStatus) {
    const task = await this.prisma.task.findFirst({ where: { id, tenantId } });
    if (!task) throw new NotFoundException('Task not found');

    // Validate transition: cannot go backwards (COMPLETED → PENDING)
    const ORDER: Record<TaskStatus, number> = {
      PENDING: 0,
      IN_PROGRESS: 1,
      PHOTO_UPLOADED: 2,
      COMPLETED: 3,
    };
    if (ORDER[status] < ORDER[task.status]) {
      throw new BadRequestException(`Cannot transition from ${task.status} to ${status}`);
    }

    return this.prisma.task.update({
      where: { id },
      data: { status },
      include: {
        staff: { select: { id: true, name: true, role: true } },
      },
    });
  }

  async assignTask(tenantId: string, id: string, staffId: string) {
    const task = await this.prisma.task.findFirst({ where: { id, tenantId } });
    if (!task) throw new NotFoundException('Task not found');

    // Verify staff member exists and belongs to this tenant
    const staffMember = await this.prisma.staffMember.findFirst({ where: { id: staffId, tenantId } });
    if (!staffMember) throw new NotFoundException('Staff member not found');

    return this.prisma.task.update({
      where: { id },
      data: {
        staffId,
        status: task.status === 'PENDING' ? 'IN_PROGRESS' : task.status,
      },
      include: {
        staff: { select: { id: true, name: true, role: true } },
      },
    });
  }

  // ── Duty Roster ──────────────────────────────────────────

  async getDutyRoster(tenantId: string, dayOfWeek?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all active staff with today's attendance record
    const staff = await this.prisma.staffMember.findMany({
      where: { tenantId, isActive: true },
      include: {
        attendance: {
          where: { day: today },
          take: 1,
        },
      },
      orderBy: { shift: 'asc' },
    });

    // Map into a roster-friendly shape
    return staff.map(s => ({
      id: s.id,
      name: s.name,
      role: s.role,
      department: s.department,
      shift: s.shift,
      shiftTime: s.shiftTime,
      phone: s.phone,
      status: s.attendance.length > 0
        ? s.attendance[0].status        // PRESENT, ABSENT, or LATE
        : 'UPCOMING' as const,          // No attendance logged yet → upcoming
      zone: s.attendance.length > 0 ? s.attendance[0].zone : null,
    }));
  }

  async getAttendanceSummary(tenantId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalStaff, present, absent, late] = await Promise.all([
      this.prisma.staffMember.count({ where: { tenantId, isActive: true } }),
      this.prisma.staffAttendance.count({
        where: { staff: { tenantId }, day: today, status: 'PRESENT' },
      }),
      this.prisma.staffAttendance.count({
        where: { staff: { tenantId }, day: today, status: 'ABSENT' },
      }),
      this.prisma.staffAttendance.count({
        where: { staff: { tenantId }, day: today, status: 'LATE' },
      }),
    ]);

    return {
      totalStaff,
      onDuty: present + late,
      absent,
      late,
      notLoggedYet: totalStaff - present - absent - late,
    };
  }
}

