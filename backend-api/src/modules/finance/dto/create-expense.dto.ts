import { IsNumber, IsString, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExpenseDto {
  @ApiProperty({ example: 'Lift Maintenance' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Maintenance' })
  @IsString()
  category: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ example: 'Otis Elevators Plc.' })
  @IsString()
  @IsOptional()
  vendorName?: string;
}
