import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { PropertyService } from './property.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { CreateUnitDto } from './dto/create-unit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Property')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post('buildings')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY)
  @ApiOperation({ summary: 'Create a new building in the society' })
  createBuilding(
    @Body() createBuildingDto: CreateBuildingDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.propertyService.createBuilding(tenantId, createBuildingDto);
  }

  @Post('buildings/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY)
  @ApiOperation({ summary: 'Update an existing building' })
  updateBuilding(
    @Body() body: { name: string },
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.propertyService.updateBuilding(tenantId, id, body.name);
  }

  @Get('buildings')
  @ApiOperation({ summary: 'List all buildings in the society' })
  findAllBuildings(@CurrentUser('tenantId') tenantId: string) {
    // All authenticated users can see the building list.
    return this.propertyService.findAllBuildings(tenantId);
  }

  @Post('units')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY)
  @ApiOperation({ summary: 'Add a new unit (flat/shop) to the society' })
  createUnit(
    @Body() createUnitDto: CreateUnitDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.propertyService.createUnit(tenantId, createUnitDto);
  }

  @Get('units')
  @ApiOperation({ summary: 'List all units with their assigned residents' })
  findAllUnits(@CurrentUser('tenantId') tenantId: string) {
    return this.propertyService.findAllUnits(tenantId);
  }
}
