import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ default: '' })
  name: string;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsUrl()
  avatarUrl: string;

  @ApiProperty({ default: '' })
  phoneNumber: string;

  @ApiProperty({ default: '' })
  birthday: Date;

  @ApiProperty({ default: '' })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ default: '' })
  address: string;
}
