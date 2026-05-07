import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUploadImageDto {
  @ApiProperty({ default: '' })
  @IsNotEmpty()
  imageData: string;

  @ApiProperty({ default: 'png' })
  format: string;

  @ApiProperty({ default: '' })
  type: string;

  @ApiProperty({ default: 0 })
  id: number;
}
