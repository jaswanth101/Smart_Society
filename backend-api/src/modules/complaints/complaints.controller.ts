import { Controller, Get, Post, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto, UpdateComplaintStatusDto } from './dto/create-complaint.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Complaints')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  @ApiOperation({ summary: 'Raise a new helpdesk ticket' })
  // Any resident can raise a complaint
  create(
    @Body() dto: CreateComplaintDto,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.complaintsService.create(tenantId, userId, dto);
  }

  @Patch(':id/status')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.SUPERVISOR, UserRole.STAFF)
  @ApiOperation({ summary: 'Update the status or assignee of a ticket' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateComplaintStatusDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.complaintsService.updateStatus(tenantId, id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all complaints (filtered safely by user role)' })
  findAll(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.complaintsService.findAll(tenantId, userId, role);
  }

  // ━━━ 2.12 Staff Rating after ticket resolution ━━━

  @Post(':id/rate')
  @ApiOperation({ summary: 'Rate staff performance after ticket resolution (1-5)' })
  rateStaff(
    @Param('id') id: string,
    @Body('rating') rating: number,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.complaintsService.rateStaff(tenantId, id, rating);
  }
}
