import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async create(tenantId: string, createUserDto: CreateUserDto) {
    const { email, phone, password, ...rest } = createUserDto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      throw new ConflictException('User with that email or phone already exists.');
    }

    // Generate secure password if not explicitly provided
    let rawPassword = password;
    if (!rawPassword) {
      const randomSuffix = Math.random().toString(36).slice(-4).toUpperCase();
      rawPassword = `${createUserDto.name.split(' ')[0]}-${randomSuffix}`;
    }

    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
        tenantId,
        ...rest,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        tenantId: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Fire welcome email workflow if they didn't manually set a password
    if (!password) {
      // Get the tenant's exact society name
      const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
      const societyName = tenant ? tenant.name : 'your new Society';
      
      this.notificationsService.sendWelcomeEmail(
        newUser.email,
        newUser.name,
        societyName,
        rawPassword
      );
    }

    return newUser;
  }

  async findAllByTenant(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        unit: {
          select: { flatNumber: true, building: { select: { name: true } } }
        }
      },
    });
  }

  // ── ONBOARDING & KYC PIPELINE ────────────────────────────────

  async getPendingUsers(tenantId: string) {
    return this.prisma.user.findMany({
      where: { 
        tenantId,
        isActive: false // Quarantined users awaiting physical verification
      },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        unit: {
          select: { flatNumber: true, building: { select: { name: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async approveUser(tenantId: string, id: string) {
    // 1. Elevate the user
    const user = await this.prisma.user.update({
      where: { id, tenantId },
      data: { isActive: true },
      include: { tenant: true }
    });

    // 2. Provision their password via Welcome Email
    const randomSuffix = Math.random().toString(36).slice(-4).toUpperCase();
    const rawPassword = `${user.name.split(' ')[0]}-${randomSuffix}`;
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });

    this.notificationsService.sendWelcomeEmail(
      user.email,
      user.name,
      user.tenant?.name || 'your Society',
      rawPassword
    );

    return { message: 'User physically verified and provisioned.' };
  }

  async rejectUser(tenantId: string, id: string) {
    // Hard delete to prevent database bloat from unverified actors
    await this.prisma.user.delete({
      where: { id, tenantId }
    });
    return { message: 'Fraudulent/Unverified profile permanently deleted.' };
  }

  // ━━━━━━━━━━━━━ TIER 2: Member Lifecycle ━━━━━━━━━━━━━

  // ── 2.13 Move-Out / Offboarding Flow ────────────────────
  // Calculate final dues → revoke RFID → mark unit VACANT → generate NOC
  async moveOutUser(tenantId: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { unit: true }
    });

    if (!user || user.tenantId !== tenantId) {
      throw new ConflictException('User not found in this society.');
    }

    // 1. Calculate pending dues
    const pendingInvoices = await this.prisma.invoice.findMany({
      where: {
        tenantId,
        unitId: user.unitId || undefined,
        status: { in: ['PENDING', 'OVERDUE'] }
      }
    });

    const totalDues = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    // 2. Revoke all RFID cards linked to this user/unit
    if (user.unitId) {
      await this.prisma.rfidCard.updateMany({
        where: { tenantId, holderName: user.name, status: 'ACTIVE' },
        data: { status: 'BLOCKED' }
      });
    }

    // 3. Deactivate user account
    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false, unitId: null }
    });

    // 4. Mark the unit as VACANT if no other active residents remain
    if (user.unitId) {
      const remainingResidents = await this.prisma.user.count({
        where: { unitId: user.unitId, isActive: true, id: { not: userId } }
      });

      if (remainingResidents === 0) {
        await this.prisma.unit.update({
          where: { id: user.unitId },
          data: { occupancy: 'VACANT' }
        });
      }
    }

    // 5. Generate NOC summary
    const noc = {
      type: 'NO_OBJECTION_CERTIFICATE',
      residentName: user.name,
      flatNumber: user.unit?.flatNumber || 'N/A',
      moveOutDate: new Date().toISOString(),
      pendingDues: totalDues,
      duesCleared: totalDues === 0,
      rfidRevoked: true,
      status: totalDues > 0 ? 'PENDING_CLEARANCE' : 'APPROVED'
    };

    return {
      message: totalDues > 0
        ? `Move-out initiated. ₹${totalDues} dues pending clearance before NOC can be issued.`
        : `Move-out complete. NOC issued. ${user.name} has been offboarded.`,
      noc,
      pendingInvoiceCount: pendingInvoices.length,
      totalDues
    };
  }

  // ── 2.14 Owner → Tenant Rights Transfer ─────────────────
  // When an owner rents their flat, suspend owner's amenity/gate access
  // and transfer primary rights to the incoming tenant.
  async transferToTenant(tenantId: string, ownerId: string, tenantUserId: string) {
    const owner = await this.prisma.user.findUnique({ where: { id: ownerId } });
    const tenant = await this.prisma.user.findUnique({ where: { id: tenantUserId } });

    if (!owner || owner.tenantId !== tenantId) {
      throw new ConflictException('Owner not found in this society.');
    }
    if (!tenant || tenant.tenantId !== tenantId) {
      throw new ConflictException('Tenant not found in this society.');
    }
    if (owner.role !== 'FLAT_OWNER') {
      throw new ConflictException('Source user is not a FLAT_OWNER.');
    }
    if (tenant.role !== 'TENANT') {
      throw new ConflictException('Target user must have TENANT role.');
    }

    const unitId = owner.unitId;
    if (!unitId) {
      throw new ConflictException('Owner has no unit assigned.');
    }

    // 1. Assign the tenant to the same unit
    await this.prisma.user.update({
      where: { id: tenantUserId },
      data: { unitId }
    });

    // 2. Suspend owner's RFID cards (they no longer live here)
    await this.prisma.rfidCard.updateMany({
      where: { tenantId, holderName: owner.name, status: 'ACTIVE' },
      data: { status: 'BLOCKED' }
    });

    // 3. Remove owner from the unit (they still exist as FLAT_OWNER but without unit access)
    await this.prisma.user.update({
      where: { id: ownerId },
      data: { unitId: null }
    });

    // 4. Mark unit as RENTED
    await this.prisma.unit.update({
      where: { id: unitId },
      data: { occupancy: 'RENTED' }
    });

    return {
      message: `Flat transferred. ${tenant.name} now has primary access. ${owner.name}'s RFID suspended.`,
      unitId,
      newOccupant: tenant.name,
      previousOccupant: owner.name,
      unitStatus: 'RENTED'
    };
  }
}
