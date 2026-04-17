import { IsNotEmpty, IsString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({ example: 'Alpha Society' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'alpha-society' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Bengaluru' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional({ example: 'Karnataka' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ example: 100 })
  @IsInt()
  @Min(0)
  @IsOptional()
  totalUnits?: number;

  @ApiPropertyOptional({ example: 'ENTERPRISE' })
  @IsString()
  @IsOptional()
  subscriptionTier?: string;
}
