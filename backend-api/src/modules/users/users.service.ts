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
}
