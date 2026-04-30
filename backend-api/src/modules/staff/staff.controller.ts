import { Controller, Get, Post, Patch, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AttendanceStatus, TaskStatus, UserRole } from '@prisma/client';

import { StaffService } from './staff.service';
import { CreateStaffDto, CreateVendorDto } from './dto/create-staff.dto';
import { CreateTaskDto, UpdateTaskStatusDto } from './dto/task.dto';
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

  // ── Tasks ──────────────────────────────────────────────────

  @Get('tasks')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.SUPERVISOR)
  @ApiOperation({ summary: 'List all tasks with assignee details' })
  findAllTasks(@CurrentUser('tenantId') tenantId: string) {
    return this.staffService.findAllTasks(tenantId);
  }

  @Post('tasks')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.SUPERVISOR)
  @ApiOperation({ summary: 'Create a new work order / task' })
  createTask(
    @Body() dto: CreateTaskDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.staffService.createTask(tenantId, dto);
  }

  @Patch('tasks/:id/status')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SUPERVISOR)
  @ApiOperation({ summary: 'Update task status (forward-only transitions)' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  updateTaskStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.staffService.updateTaskStatus(tenantId, id, dto.status);
  }

  @Patch('tasks/:id/assign')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SUPERVISOR)
  @ApiOperation({ summary: 'Assign a task to a staff member' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  assignTask(
    @Param('id') id: string,
    @Body('staffId') staffId: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.staffService.assignTask(tenantId, id, staffId);
  }

  // ── Duty Roster ──────────────────────────────────────────

  @Get('roster')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.SUPERVISOR)
  @ApiOperation({ summary: 'Get today\'s duty roster with attendance status' })
  getDutyRoster(
    @CurrentUser('tenantId') tenantId: string,
    @Query('day') day?: string,
  ) {
    return this.staffService.getDutyRoster(tenantId, day);
  }

  @Get('roster/summary')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.SUPERVISOR)
  @ApiOperation({ summary: 'Get attendance summary counts for today' })
  getAttendanceSummary(@CurrentUser('tenantId') tenantId: string) {
    return this.staffService.getAttendanceSummary(tenantId);
  }
}

