import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ default: '' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ default: '' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ default: 0 })
  @IsNotEmpty()
  roleId: number;
}
