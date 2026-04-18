import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { CreateUnitDto } from './dto/create-unit.dto';

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
}
