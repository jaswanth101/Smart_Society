import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ example: 'president@alphasociety.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiProperty({ example: '+91 99999 00000', required: false })
  @IsString()
  @IsOptional()
  phone?: string

  @ApiProperty({ example: 'SecureP@ss123', required: false })
  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string

  @ApiProperty({ example: 'society_alpha', required: false })
  @IsString()
  @IsOptional()
  tenantId?: string
}
