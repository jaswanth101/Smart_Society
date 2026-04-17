import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { AccessControlService } from './access-control.service';
import { CreateRfidDto, CreateGateLogDto } from './dto/create-access.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Access Control')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('access-control')
export class AccessControlController {
  constructor(private readonly accessService: AccessControlService) {}

  // ── RFID Management ─────────────────────────────────────

  @Post('rfid')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SUPERVISOR)
  @ApiOperation({ summary: 'Assign a new RFID key fob or card' })
  assignRfid(
    @Body() dto: CreateRfidDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.accessService.assignRfid(tenantId, dto);
  }

  @Get('rfid')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SUPERVISOR)
  @ApiOperation({ summary: 'View all active RFID cards in society' })
  findAllRfids(@CurrentUser('tenantId') tenantId: string) {
    return this.accessService.findAllRfids(tenantId);
  }

  // ── Hardware IoT Logging ────────────────────────────────

  @Post('gate-logs')
  // This endpoint would realistically be protected by a Machine-to-Machine token.
  // For MVP, limiting to security guards, supervisors, and admins.
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SUPERVISOR, UserRole.SECURITY_GUARD)
  @ApiOperation({ summary: 'System endpoint: Log a gate open/close event from edge device' })
  logGateAction(
    @Body() dto: CreateGateLogDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.accessService.logGateAction(tenantId, dto);
  }

  @Get('gate-logs')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SUPERVISOR, UserRole.SECURITY_GUARD)
  @ApiOperation({ summary: 'View recent gate entry/exit telemetry logs' })
  fetchGateLogs(@CurrentUser('tenantId') tenantId: string) {
    return this.accessService.fetchGateLogs(tenantId, 50); // Get last 50 logs
  }
}
