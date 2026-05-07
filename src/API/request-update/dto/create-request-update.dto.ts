import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRequestUpdateDto {
  @ApiProperty({ default: '' })
  @IsNotEmpty()
  content: string;

  @ApiProperty({ default: '' })
  @IsNotEmpty()
  feedback: string;

  @ApiProperty({ default: '' })
  @IsNotEmpty()
  moduleName: string;

  @ApiProperty({ default: '' })
  @IsNotEmpty()
  actionName: string;

  @ApiProperty({ default: 0 })
  @IsNotEmpty()
  idUpdate: number;
}
