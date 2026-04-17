import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UnitType, UnitOccupancy } from '@prisma/client';

export class CreateUnitDto {
  @ApiProperty({ example: '101A' })
  @IsString()
  @IsNotEmpty()
  flatNumber: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0)
  floor: number;

  @ApiProperty({ enum: UnitType, example: UnitType.BHK2 })
  @IsEnum(UnitType)
  type: UnitType;

  @ApiProperty({ example: 1200 })
  @IsInt()
  @Min(1)
  sqft: number;

  @ApiProperty({ enum: UnitOccupancy, example: UnitOccupancy.VACANT })
  @IsEnum(UnitOccupancy)
  occupancy: UnitOccupancy;

  @ApiProperty({ example: 'uuid-of-building' })
  @IsString()
  @IsNotEmpty()
  buildingId: string;
}
