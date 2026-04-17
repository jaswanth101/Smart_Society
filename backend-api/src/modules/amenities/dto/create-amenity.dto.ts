import { IsString, IsNotEmpty, IsInt, Min, IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AmenityStatus } from '@prisma/client';

export class CreateAmenityDto {
  @ApiProperty({ example: 'Swimming Pool' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(1)
  maxCapacity: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1)
  quotaPerWeek: number;

  @ApiProperty({ example: '6AM-10PM' })
  @IsString()
  @IsNotEmpty()
  timings: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  rfidRequired?: boolean;

  @ApiPropertyOptional({ enum: AmenityStatus, example: AmenityStatus.ACTIVE })
  @IsEnum(AmenityStatus)
  @IsOptional()
  status?: AmenityStatus;
}
