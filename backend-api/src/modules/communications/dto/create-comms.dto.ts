import { IsString, IsNotEmpty, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNoticeDto {
  @ApiProperty({ example: 'Water Supply Interruption' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'No water inside bathrooms tomorrow 9AM to 5PM due to tank cleaning.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isAnniversaryOrEvent?: boolean;
}

export class CreateBroadcastDto {
  @ApiProperty({ example: 'Security Update' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Main gate boom barrier is operational again.' })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({ example: 'SMS' }) // Simplified enum as string for example MVP
  @IsString()
  @IsOptional()
  channel?: string;
}
