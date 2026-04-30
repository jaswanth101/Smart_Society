import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VehicleType, ParkingStatus } from '@prisma/client';

export class CreateParkingSlotDto {
  @ApiProperty({ example: 'B1-001' })
  @IsString()
  @IsNotEmpty()
  slotNumber: string;

  @ApiProperty({ example: 'Basement 1' })
  @IsString()
  @IsNotEmpty()
  zone: string;

  @ApiPropertyOptional({ enum: VehicleType, example: VehicleType.CAR })
  @IsEnum(VehicleType)
  @IsOptional()
  vehicleType?: VehicleType;

  @ApiPropertyOptional({ example: 'unit-uuid-here' })
  @IsString()
  @IsOptional()
  unitId?: string;

  @ApiPropertyOptional({ example: 'KA-01-AB-1234' })
  @IsString()
  @IsOptional()
  vehicle?: string;
}

export class UpdateParkingSlotDto {
  @ApiPropertyOptional({ enum: ParkingStatus })
  @IsEnum(ParkingStatus)
  @IsOptional()
  status?: ParkingStatus;

  @ApiPropertyOptional({ enum: VehicleType })
  @IsEnum(VehicleType)
  @IsOptional()
  vehicleType?: VehicleType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  zone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  unitId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  vehicle?: string;
}

export class AssignSlotDto {
  @ApiProperty({ example: 'unit-uuid-here' })
  @IsString()
  @IsNotEmpty()
  unitId: string;

  @ApiPropertyOptional({ example: 'KA-01-AB-1234' })
  @IsString()
  @IsOptional()
  vehicle?: string;
}
