import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GateAction } from '@prisma/client';

export class CreateRfidDto {
  @ApiProperty({ example: 'E200001B0...' })
  @IsString()
  @IsNotEmpty()
  uid: string;

  @ApiProperty({ example: 'John Smith' })
  @IsString()
  @IsNotEmpty()
  holderName: string;

  @ApiProperty({ example: 'OWNER' })
  @IsString()
  @IsNotEmpty()
  holderType: string;
}

export class CreateGateLogDto {
  @ApiProperty({ example: 'Main Gate EN' })
  @IsString()
  @IsNotEmpty()
  gate: string;

  @ApiProperty({ enum: GateAction, example: GateAction.OPEN })
  @IsEnum(GateAction)
  action: GateAction;

  @ApiProperty({ example: 'E200001B0...' })
  @IsString()
  @IsOptional()
  actor?: string;

  @ApiProperty({ example: 'RFID' })
  @IsString()
  method: string;
}
