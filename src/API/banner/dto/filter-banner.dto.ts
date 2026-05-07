import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterBannerDto {
  @ApiProperty({ required: false })
  @Type(() => Number)
  competitionId: number;

  @ApiProperty({ default: 0, required: false })
  @Type(() => Number)
  skip: number;

  @ApiProperty({ default: 20, required: false })
  @Type(() => Number)
  take: number;

  @ApiProperty({ default: 'createdAt', required: false })
  key: string;

  @ApiProperty({ default: 'desc', required: false })
  value: string;
}
