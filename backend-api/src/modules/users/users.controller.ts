import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY)
  @ApiOperation({ summary: 'Create a new user in the current society' })
  create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser('tenantId') tenantId: string, // Extract tenantId from token safely
  ) {
    return this.usersService.create(tenantId, createUserDto);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY)
  @ApiOperation({ summary: 'Get all active users in the current society' })
  findAll(@CurrentUser('tenantId') tenantId: string) {
    return this.usersService.findAllByTenant(tenantId);
  }

  // ── ONBOARDING & KYC PIPELINE ────────────────────────────────

  @Get('pending')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY)
  @ApiOperation({ summary: 'Get all quarantined/pending users awaiting physical verification' })
  getPendingUsers(@CurrentUser('tenantId') tenantId: string) {
    return this.usersService.getPendingUsers(tenantId);
  }

  @Patch(':id/approve')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY)
  @ApiOperation({ summary: 'Physically verify and provision a pending member' })
  approveUser(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string
  ) {
    return this.usersService.approveUser(tenantId, id);
  }

  @Patch(':id/reject')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY)
  @ApiOperation({ summary: 'Permanently purge an unverified fraudulent profile' })
  rejectUser(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string
  ) {
    return this.usersService.rejectUser(tenantId, id);
  }
}
