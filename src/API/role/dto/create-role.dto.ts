import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ default: '' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ default: '' })
  @IsNotEmpty()
  permission: string;

  @ApiProperty({ default: '' })
  @IsNotEmpty()
  description: string;
}
