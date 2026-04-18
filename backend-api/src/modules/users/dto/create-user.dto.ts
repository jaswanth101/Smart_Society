import { IsEmail, IsNotEmpty, IsString, IsEnum, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: 'password123' })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({ enum: UserRole, example: UserRole.FLAT_OWNER })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({ example: 'unit-uuid' })
  @IsString()
  @IsOptional()
  unitId?: string;

  // The tenantId will be injected by the controller based on the incoming request route or user context.
}
