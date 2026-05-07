import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateCompetitionDto {

  @ApiProperty({ default: '' })
  @IsNotEmpty()
  @MinLength(10)
  title: string;

  @ApiProperty({ default: '' })
  @IsNotEmpty()
  @MinLength(100)
  content: string;

  @ApiProperty({ default: '' })
  @IsNotEmpty()
  startDateApply: Date;

  @ApiProperty({ default: '' })
  @IsNotEmpty()
  endDateApply: Date;

  @ApiProperty({ default: '' })
  @IsNotEmpty()
  startDateCompetition: Date;

  @ApiProperty({ default: '' })
  @IsNotEmpty()
  endDateCompetition: Date;

  @ApiProperty({ default: 0 })
  @IsNotEmpty()
  maxNumberApply: number;

  @ApiProperty({ default: '' })
  applyStatus: string;
}
