import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class TenantsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async create(createTenantDto: CreateTenantDto) {
    // 1. Pre-validation checks
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { slug: createTenantDto.slug },
    });

    if (existingTenant) {
      throw new ConflictException(`Tenant with slug '${createTenantDto.slug}' already exists.`);
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: createTenantDto.adminEmail },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered to another society.');
    }

    // 2. Generate Smart Password (e.g., Alpha-7x92)
    const randomSuffix = Math.random().toString(36).slice(-4).toUpperCase();
    const rawPassword = `${createTenantDto.name.split(' ')[0]}-${randomSuffix}`;
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // 3. Execute Core Provisioning Transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Step A: Create Tenant
      const tenant = await tx.tenant.create({
        data: {
          name: createTenantDto.name,
          slug: createTenantDto.slug,
          address: createTenantDto.address,
          city: createTenantDto.city,
          state: createTenantDto.state,
          totalUnits: createTenantDto.totalUnits,
          subscriptionTier: createTenantDto.subscriptionTier,
          subscriptionPrice: createTenantDto.subscriptionPrice,
        },
      });

      const tower = await tx.building.create({
        data: {
          name: 'Tower A',
          tenantId: tenant.id,
        },
      });

      // Step C: Create President
      await tx.user.create({
        data: {
          name: createTenantDto.adminName || 'Admin',
          email: createTenantDto.adminEmail,
          phone: createTenantDto.adminPhone,
          password: hashedPassword,
          role: UserRole.PRESIDENT,
          tenantId: tenant.id,
        },
      });

      return { tenant, generatedPassword: rawPassword };
    });

    // 4. Fire Live SMTP Welcome Email
    this.notificationsService.sendWelcomeEmail(
      createTenantDto.adminEmail,
      createTenantDto.adminName || 'Admin',
      createTenantDto.name,
      rawPassword
    );

    // Return the payload back to the Super Admin UI so they can see the password
    return result;
  }

  async findAll() {
    return this.prisma.tenant.findMany({
      include: {
        _count: {
          select: { users: true, units: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant not found.`);
    }

    return tenant;
  }

  async getGlobalAnalytics() {
    // Sum total MRR
    const revenueSum = await this.prisma.tenant.aggregate({
      _sum: { subscriptionPrice: true },
      where: { isActive: true },
    });

    // Count all active resident/staff users globally
    const totalUsers = await this.prisma.user.count({
      where: { isActive: true },
    });

    // Count all active tenants
    const totalTenants = await this.prisma.tenant.count({
      where: { isActive: true },
    });

    // Count online edge nodes
    const onlineNodes = await this.prisma.edgeNode.count({
      where: { status: 'ONLINE' },
    });
    
    // Count total edge nodes
    const totalNodes = await this.prisma.edgeNode.count();

    return {
      mrr: revenueSum._sum.subscriptionPrice || 0,
      activeSocieties: totalTenants,
      totalResidents: totalUsers,
      edgeServersOnline: onlineNodes,
      edgeServersTotal: totalNodes,
    };
  }
}
