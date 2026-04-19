import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { AmenitiesService } from './amenities.service';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Amenities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY)
  @ApiOperation({ summary: 'Create a new society amenity' })
  create(
    @Body() dto: CreateAmenityDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.amenitiesService.create(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all facilities in the society' })
  // All authenticated users can see amenities
  findAll(@CurrentUser('tenantId') tenantId: string) {
    return this.amenitiesService.findAll(tenantId);
  }

  @Post(':id/status') // Note: We use POST for simplicity of patching via standard JSON
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY)
  @ApiOperation({ summary: 'Update status of an amenity (e.g. Block due to maintenance)' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.amenitiesService.updateStatus(tenantId, id, status);
  }
}
