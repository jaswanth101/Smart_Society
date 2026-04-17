import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TicketPriority, TicketStatus } from '@prisma/client';

export class CreateComplaintDto {
  @ApiProperty({ example: 'Water Leakage' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Water leaking from ceiling in master bedroom' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Plumbing' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional({ enum: TicketPriority, example: TicketPriority.HIGH })
  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @ApiPropertyOptional({ example: ['https://s3/leak.jpg'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  photos?: string[];
}

export class UpdateComplaintStatusDto {
  @ApiProperty({ enum: TicketStatus, example: TicketStatus.IN_PROGRESS })
  @IsEnum(TicketStatus)
  status: TicketStatus;

  @ApiPropertyOptional({ example: 'uuid-of-staff' })
  @IsString()
  @IsOptional()
  assignedToId?: string;
}
