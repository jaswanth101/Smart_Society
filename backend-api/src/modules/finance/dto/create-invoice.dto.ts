import { IsNumber, IsString, Min, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InvoiceStatus } from '@prisma/client';

export class CreateInvoiceDto {
  @ApiProperty({ example: 2500 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: '2026-05-05T00:00:00Z' })
  @IsDateString()
  dueDate: string;

  @ApiProperty({ example: 'MAY' })
  @IsString()
  month: string;

  @ApiProperty({ example: 2026 })
  @IsNumber()
  year: number;

  @ApiPropertyOptional({ enum: InvoiceStatus, example: InvoiceStatus.PENDING })
  @IsEnum(InvoiceStatus)
  @IsOptional()
  status?: InvoiceStatus;

  @ApiProperty({ example: 'uuid-of-unit' })
  @IsString()
  unitId: string;
}
