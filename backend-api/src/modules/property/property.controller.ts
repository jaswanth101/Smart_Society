import { Controller, Get, Post, Patch, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { PropertyService } from './property.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { CreateUnitDto } from './dto/create-unit.dto';
import { CreateParkingSlotDto, UpdateParkingSlotDto, AssignSlotDto } from './dto/parking-slot.dto';
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

  // ── PARKING SLOTS ──────────────────────────────────────────

  @Get('parking')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.SUPERVISOR, UserRole.FLAT_OWNER, UserRole.TENANT)
  @ApiOperation({ summary: 'List all parking slots with assignment info' })
  findAllParkingSlots(@CurrentUser('tenantId') tenantId: string) {
    return this.propertyService.findAllParkingSlots(tenantId);
  }

  @Post('parking')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY)
  @ApiOperation({ summary: 'Register a new parking slot' })
  createParkingSlot(
    @Body() dto: CreateParkingSlotDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.propertyService.createParkingSlot(tenantId, dto);
  }

  @Patch('parking/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY)
  @ApiOperation({ summary: 'Update a parking slot (zone, type, status)' })
  @ApiParam({ name: 'id', description: 'Parking slot ID' })
  updateParkingSlot(
    @Param('id') id: string,
    @Body() dto: UpdateParkingSlotDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.propertyService.updateParkingSlot(tenantId, id, dto);
  }

  @Post('parking/:id/assign')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY)
  @ApiOperation({ summary: 'Assign a parking slot to a specific flat' })
  @ApiParam({ name: 'id', description: 'Parking slot ID' })
  assignSlot(
    @Param('id') id: string,
    @Body() dto: AssignSlotDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.propertyService.assignSlot(tenantId, id, dto.unitId, dto.vehicle);
  }

  @Post('parking/:id/release')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY)
  @ApiOperation({ summary: 'Release a parking slot — clears assignment, sets to AVAILABLE' })
  @ApiParam({ name: 'id', description: 'Parking slot ID' })
  releaseSlot(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.propertyService.releaseSlot(tenantId, id);
  }
}

