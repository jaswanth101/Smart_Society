import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { SecurityService } from './security.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Security')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  // ── 2.7 SOS Panic Button ─────────────────────────────────
  @Post('sos')
  @ApiOperation({ summary: 'Trigger SOS panic alert — notifies all guards and supervisors' })
  triggerSOS(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('id') userId: string,
    @Body('location') location?: string,
  ) {
    return this.securityService.triggerSOS(tenantId, userId, location);
  }

  // ── 2.8 Emergency Broadcast ──────────────────────────────
  @Post('emergency-broadcast')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT)
  @ApiOperation({ summary: 'President-only emergency blast to ALL residents + staff' })
  emergencyBroadcast(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('id') senderId: string,
    @Body('title') title: string,
    @Body('message') message: string,
  ) {
    return this.securityService.emergencyBroadcast(tenantId, senderId, title, message);
  }
}
