import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AttendanceStatus, UserRole } from '@prisma/client';

import { StaffService } from './staff.service';
import { CreateStaffDto, CreateVendorDto } from './dto/create-staff.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Staff & Vendors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SUPERVISOR)
  @ApiOperation({ summary: 'Register a new staff member' })
  createStaff(
    @Body() dto: CreateStaffDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.staffService.createStaff(tenantId, dto);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.SUPERVISOR)
  @ApiOperation({ summary: 'List all internal staff' })
  findAllStaff(@CurrentUser('tenantId') tenantId: string) {
    return this.staffService.findAllStaff(tenantId);
  }

  @Post(':id/attendance')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SUPERVISOR)
  @ApiOperation({ summary: 'Log daily attendance for a staff member' })
  @ApiParam({ name: 'id', description: 'Staff ID' })
  logAttendance(
    @Param('id') id: string,
    @Body('status') status: AttendanceStatus,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.staffService.logAttendance(tenantId, id, status);
  }

  // ── Vendors ──

  @Post('vendors')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY)
  @ApiOperation({ summary: 'Register a 3rd party maintenance vendor' })
  createVendor(
    @Body() dto: CreateVendorDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.staffService.createVendor(tenantId, dto);
  }

  @Get('vendors')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.TREASURER)
  @ApiOperation({ summary: 'List all vendors with contract values' })
  findAllVendors(@CurrentUser('tenantId') tenantId: string) {
    return this.staffService.findAllVendors(tenantId);
  }
}
