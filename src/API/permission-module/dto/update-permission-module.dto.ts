import { ApiProperty } from '@nestjs/swagger';
export class UpdatePermissionModuleDto {
  @ApiProperty({ default: '' })
  description: string;
}
