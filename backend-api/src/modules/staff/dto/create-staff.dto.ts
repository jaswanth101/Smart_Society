import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StaffShiftType, VendorStatus } from '@prisma/client';

export class CreateStaffDto {
  @ApiProperty({ example: 'Ramesh Guard' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Security Guard' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ example: 'Security' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({ example: '+918888888888' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ enum: StaffShiftType, example: StaffShiftType.NIGHT })
  @IsEnum(StaffShiftType)
  @IsOptional()
  shift?: StaffShiftType;

  @ApiPropertyOptional({ example: '8PM-8AM' })
  @IsString()
  @IsOptional()
  shiftTime?: string;
}

export class CreateVendorDto {
  @ApiProperty({ example: 'CleanCo Services' })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({ example: 'Housekeeping' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'Suresh Kumar' })
  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @ApiProperty({ example: '+917777777777' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: 15000 })
  @IsNumber()
  @IsOptional()
  monthlyValue?: number;

  @ApiPropertyOptional({ enum: VendorStatus, example: VendorStatus.ACTIVE })
  @IsEnum(VendorStatus)
  @IsOptional()
  status?: VendorStatus;
}
