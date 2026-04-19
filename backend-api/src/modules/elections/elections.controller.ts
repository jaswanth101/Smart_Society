import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { ElectionsService } from './elections.service';
import { CreateElectionDto } from './dto/create-election.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Elections')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('elections')
export class ElectionsController {
  constructor(private readonly electionsService: ElectionsService) {}

  @Get('active')
  @ApiOperation({ summary: 'Get current active election & live stats' })
  getActiveElection(@CurrentUser('tenantId') tenantId: string) {
    return this.electionsService.getActiveElection(tenantId);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT)
  @ApiOperation({ summary: 'Start a new election' })
  createElection(
    @Body() dto: CreateElectionDto,
    @CurrentUser('tenantId') tenantId: string
  ) {
    return this.electionsService.createElection(tenantId, dto);
  }

  @Post(':id/resolve')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT)
  @ApiOperation({ summary: 'Seal election and execute handover protocol' })
  resolveElection(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string
  ) {
    return this.electionsService.resolveElection(tenantId, id);
  }
}
