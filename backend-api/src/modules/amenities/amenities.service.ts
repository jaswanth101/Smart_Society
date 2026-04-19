import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateAmenityDto } from './dto/create-amenity.dto';

@Injectable()
export class AmenitiesService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateAmenityDto) {
    return this.prisma.amenity.create({
      data: { ...dto, tenantId },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.amenity.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });
  }

  async updateStatus(tenantId: string, id: string, status: any) {
    return this.prisma.amenity.update({
      where: { id, tenantId },
      data: { status },
    });
  }
}
