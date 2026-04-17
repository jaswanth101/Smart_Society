import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVisitorDto {
  @ApiProperty({ example: 'John Smith' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Delivery' })
  @IsString()
  @IsNotEmpty()
  purpose: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'KA01AB1234' })
  @IsString()
  @IsOptional()
  vehicleNo?: string;

  @ApiProperty({ example: 'uuid-of-unit' })
  @IsString()
  @IsNotEmpty()
  hostUnitId: string;

  @ApiProperty({ example: '2026-05-10T14:30:00Z' })
  @IsDateString()
  @IsNotEmpty()
  scheduledAt: string;
}
