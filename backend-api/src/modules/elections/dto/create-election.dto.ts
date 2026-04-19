import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateElectionDto {
  @ApiProperty({ example: 'Annual Society Elections 2026' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Election for President and Committee Members' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 50, description: 'Percentage of units required to vote for valid election' })
  @IsInt()
  @Min(1)
  @IsOptional()
  quorum?: number;
}
