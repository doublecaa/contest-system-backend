import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdminDto {
  @ApiProperty({ default: 0 })
  roleId: number;

  @ApiProperty({ default: '' })
  name: string;

  @ApiProperty({ default: 1 })
  status: number;
}
