import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterResultDto {
  @ApiProperty({ default: '', required: false })
  name: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  candidateId: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  competitionId: number;

  @ApiProperty({ required: false })
  identificationNumber: string;

  @ApiProperty({ default: 0, required: false })
  @Type(() => Number)
  skip: 0;

  @ApiProperty({ default: 20, required: false })
  @Type(() => Number)
  take: 20;

  @ApiProperty({ default: 'createdAt', required: false })
  key: string;

  @ApiProperty({ default: 'desc', required: false })
  value: string;
}
