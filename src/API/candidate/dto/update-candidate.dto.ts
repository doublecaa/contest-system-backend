import { ApiProperty } from '@nestjs/swagger';

export class UpdateCandidateDto {
  @ApiProperty({ default: 0 })
  banned: number;
}
