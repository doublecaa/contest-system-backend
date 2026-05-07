import { ApiProperty } from '@nestjs/swagger';

export class FilterRoleDto {
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ default: 0, required: false })
  skip: number;

  @ApiProperty({ default: 20, required: false })
  take: number;

  @ApiProperty({ default: 'createdAt', required: false })
  key: string;

  @ApiProperty({ default: 'desc', required: false })
  value: string;
}
