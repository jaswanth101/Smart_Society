import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { CreateUnitDto } from './dto/create-unit.dto';
import { CreateParkingSlotDto, UpdateParkingSlotDto } from './dto/parking-slot.dto';

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  async createBuilding(tenantId: string, createBuildingDto: CreateBuildingDto) {
    return this.prisma.building.create({
      data: {
        ...createBuildingDto,
        tenantId,
      },
    });
  }

  async updateBuilding(tenantId: string, id: string, name: string) {
    // Make sure building exists and belongs to tenant
    const existing = await this.prisma.building.findFirst({
      where: { id, tenantId }
    });
    if (!existing) throw new NotFoundException('Building not found');

    return this.prisma.building.update({
      where: { id },
      data: { name }
    });
  }

  async findAllBuildings(tenantId: string) {
    return this.prisma.building.findMany({
      where: { tenantId },
      include: {
        _count: { select: { units: true } }
      }
    });
  }

  async createUnit(tenantId: string, createUnitDto: CreateUnitDto) {
    // Check if flat number already exists in society
    const existing = await this.prisma.unit.findFirst({
      where: { tenantId, flatNumber: createUnitDto.flatNumber },
    });

    if (existing) {
      throw new ConflictException(`Flat ${createUnitDto.flatNumber} already exists in this society.`);
    }

    return this.prisma.unit.create({
      data: {
        ...createUnitDto,
        tenantId,
      },
    });
  }

  async findAllUnits(tenantId: string) {
    return this.prisma.unit.findMany({
      where: { tenantId },
      include: {
        building: { select: { name: true } },
        residents: { select: { id: true, name: true, phone: true } }
      }
    });
  }

  // ── PARKING SLOTS ──────────────────────────────────────────

  async createParkingSlot(tenantId: string, dto: CreateParkingSlotDto) {
    // Enforce unique slot number per society
    const existing = await this.prisma.parkingSlot.findUnique({
      where: { tenantId_slotNumber: { tenantId, slotNumber: dto.slotNumber } },
    });
    if (existing) {
      throw new ConflictException(`Slot ${dto.slotNumber} already exists in this society.`);
    }

    return this.prisma.parkingSlot.create({
      data: {
        ...dto,
        tenantId,
        status: dto.unitId ? 'ASSIGNED' : 'AVAILABLE',
      },
      include: {
        unit: { select: { flatNumber: true, building: { select: { name: true } }, residents: { select: { name: true } } } },
      },
    });
  }

  async findAllParkingSlots(tenantId: string) {
    return this.prisma.parkingSlot.findMany({
      where: { tenantId },
      include: {
        unit: { select: { flatNumber: true, building: { select: { name: true } }, residents: { select: { name: true } } } },
      },
      orderBy: { slotNumber: 'asc' },
    });
  }

  async updateParkingSlot(tenantId: string, id: string, dto: UpdateParkingSlotDto) {
    const existing = await this.prisma.parkingSlot.findFirst({ where: { id, tenantId } });
    if (!existing) throw new NotFoundException('Parking slot not found');

    return this.prisma.parkingSlot.update({
      where: { id },
      data: dto,
      include: {
        unit: { select: { flatNumber: true, building: { select: { name: true } }, residents: { select: { name: true } } } },
      },
    });
  }

  async assignSlot(tenantId: string, id: string, unitId: string, vehicle?: string) {
    const slot = await this.prisma.parkingSlot.findFirst({ where: { id, tenantId } });
    if (!slot) throw new NotFoundException('Parking slot not found');
    if (slot.status === 'ASSIGNED') {
      throw new ConflictException('Slot is already assigned. Release it first.');
    }

    return this.prisma.parkingSlot.update({
      where: { id },
      data: { unitId, vehicle: vehicle || null, status: 'ASSIGNED' },
      include: {
        unit: { select: { flatNumber: true, building: { select: { name: true } }, residents: { select: { name: true } } } },
      },
    });
  }

  async releaseSlot(tenantId: string, id: string) {
    const slot = await this.prisma.parkingSlot.findFirst({ where: { id, tenantId } });
    if (!slot) throw new NotFoundException('Parking slot not found');

    return this.prisma.parkingSlot.update({
      where: { id },
      data: { unitId: null, vehicle: null, status: 'AVAILABLE' },
    });
  }
}
