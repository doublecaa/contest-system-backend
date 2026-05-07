import { ApiProperty } from '@nestjs/swagger';

export class FilterRequestUpdateDto {
  @ApiProperty({ required: false })
  adminId: number;

  @ApiProperty({ default: 0, required: false })
  skip: number;

  @ApiProperty({ default: 20, required: false })
  take: number;

  @ApiProperty({ default: 'createdAt', required: false })
  key: string;

  @ApiProperty({ default: 'desc', required: false })
  value: string;
}
