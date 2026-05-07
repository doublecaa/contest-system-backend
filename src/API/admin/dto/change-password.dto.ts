import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ default: '' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ default: '' })
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
