import { Controller, Get, Post, Body, Param, UseGuards, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { VisitorsService } from './visitors.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Visitors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Post()
  @ApiOperation({ summary: 'Schedule a new visitor to the society' })
  // Any authenticated user can create a visitor, but logic limits to their unit or everything if super/admin
  create(
    @Body() dto: CreateVisitorDto,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('unitId') currentUnitId: string,
  ) {
    return this.visitorsService.create(tenantId, currentUnitId, dto);
  }

  @Patch(':id/checkin')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECURITY_GUARD)
  @ApiOperation({ summary: 'Mark a visitor as currently checked-in at the gate' })
  @ApiParam({ name: 'id', description: 'Visitor ID' })
  checkIn(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.visitorsService.checkIn(tenantId, id);
  }

  @Get()
  @ApiOperation({ summary: 'List visitors. Residents only see their own.' })
  @ApiQuery({ name: 'unitId', required: false })
  findAll(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('role') role: string,
    @CurrentUser('unitId') currentUnitId: string,
    @Query('unitId') filterUnitId?: string,
  ) {
    const isAdmin = ([UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.SECURITY_GUARD] as UserRole[]).includes(role as UserRole);
    // Residents override query filter to only see their own hostUnitId
    const targetUnit = isAdmin ? filterUnitId : currentUnitId;
    return this.visitorsService.findAll(tenantId, targetUnit);
  }

  @Patch(':id/checkout')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECURITY_GUARD)
  @ApiOperation({ summary: 'Mark a visitor as checked-out (departed)' })
  @ApiParam({ name: 'id', description: 'Visitor ID' })
  checkOut(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.visitorsService.checkOut(tenantId, id);
  }

  // ━━━ 2.9 Visitor Blacklist ━━━

  @Patch(':id/reject')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECURITY_GUARD)
  @ApiOperation({ summary: 'Blacklist/reject a visitor permanently' })
  @ApiParam({ name: 'id', description: 'Visitor ID' })
  rejectVisitor(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.visitorsService.rejectVisitor(tenantId, id);
  }

  @Get('blacklist')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECURITY_GUARD)
  @ApiOperation({ summary: 'List all blacklisted (rejected) visitors' })
  getBlacklist(@CurrentUser('tenantId') tenantId: string) {
    return this.visitorsService.getBlacklist(tenantId);
  }
}
