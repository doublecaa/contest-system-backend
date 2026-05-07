import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({ default: '' })
  name: string;

  @ApiProperty({ default: '' })
  permission: string;

  @ApiProperty({ default: '' })
  description: string;
}
