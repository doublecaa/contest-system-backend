import { ApiProperty } from '@nestjs/swagger';

export class UpdateRequestUpdateDto {
  @ApiProperty({ default: '' })
  content: string;

  @ApiProperty({ default: '' })
  feedback: string;

  @ApiProperty({ default: '' })
  moduleName: string;

  @ApiProperty({ default: '' })
  actionName: string;

  @ApiProperty({ default: 0 })
  idUpdate: number;

  @ApiProperty({ default: '' })
  status: string;
}
