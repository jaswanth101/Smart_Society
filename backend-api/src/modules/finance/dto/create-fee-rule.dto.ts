import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UnitType } from '@prisma/client';

export class CreateFeeRuleDto {
  @ApiProperty({ enum: UnitType, example: UnitType.BHK2 })
  @IsEnum(UnitType)
  unitType: UnitType;

  @ApiProperty({ example: 2500 })
  @IsNumber()
  @Min(0)
  baseAmount: number;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  lateFeePercent?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  dueDay?: number;

  @ApiPropertyOptional({ example: 'MONTHLY' })
  @IsString()
  @IsOptional()
  frequency?: string;
}
