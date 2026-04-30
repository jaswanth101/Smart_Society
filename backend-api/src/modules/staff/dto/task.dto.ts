import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TicketPriority, TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({ example: 'Clean lobby mirrors — Tower A' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Tower A' })
  @IsString()
  @IsOptional()
  zone?: string;

  @ApiPropertyOptional({ enum: TicketPriority, example: TicketPriority.MEDIUM })
  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @ApiPropertyOptional({ example: 'staff-uuid-here' })
  @IsString()
  @IsOptional()
  staffId?: string;

  @ApiPropertyOptional({ example: '2026-04-30T18:00:00Z' })
  @IsDateString()
  @IsOptional()
  dueBy?: string;
}

export class UpdateTaskStatusDto {
  @ApiProperty({ enum: TaskStatus, example: TaskStatus.IN_PROGRESS })
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;
}
