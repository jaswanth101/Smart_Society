import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { CommunicationsService } from './communications.service';
import { CreateNoticeDto, CreateBroadcastDto } from './dto/create-comms.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Communications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('communications')
export class CommunicationsController {
  constructor(private readonly commService: CommunicationsService) {}

  // ── Notices ─────────────────────────────────────────────

  @Post('notices')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY)
  @ApiOperation({ summary: 'Post a society-wide notice' })
  createNotice(
    @Body() dto: CreateNoticeDto,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('id') authorId: string,
  ) {
    return this.commService.createNotice(tenantId, authorId, dto);
  }

  @Get('notices')
  @ApiOperation({ summary: 'List the active digital bulletin board notices' })
  // Any logged-in resident can see notices
  findAllNotices(@CurrentUser('tenantId') tenantId: string) {
    return this.commService.findAllNotices(tenantId);
  }

  // ── Broadcasts ──────────────────────────────────────────

  @Post('broadcasts')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY)
  @ApiOperation({ summary: 'Dispatch a push notification or SMS globally' })
  dispatchBroadcast(
    @Body() dto: CreateBroadcastDto,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('id') senderId: string,
  ) {
    return this.commService.dispatchBroadcast(tenantId, senderId, dto);
  }

  @Get('broadcasts')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY)
  @ApiOperation({ summary: 'View previously sent broadcast telemetry' })
  fetchBroadcastHistory(@CurrentUser('tenantId') tenantId: string) {
    return this.commService.fetchBroadcastHistory(tenantId);
  }
}
