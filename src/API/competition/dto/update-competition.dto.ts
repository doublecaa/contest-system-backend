import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MinLength } from 'class-validator';

export class UpdateCompetitionDto {
  @ApiProperty({ default: 0 })
  categoryCompetitionId: number;

  @ApiProperty({ default: '' })
  @IsOptional()
  @MinLength(10)
  title: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @MinLength(100)
  content: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  startDateApply: Date;

  @ApiProperty({ default: '' })
  @IsOptional()
  endDateApply: Date;

  @ApiProperty({ default: '' })
  @IsOptional()
  startDateCompetition: Date;

  @ApiProperty({ default: '' })
  @IsOptional()
  endDateCompetition: Date;

  @ApiProperty({ default: 0 })
  maxNumberApply: number;

  @ApiProperty({ default: 0 })
  pending: number;
}
