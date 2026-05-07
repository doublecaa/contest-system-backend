import { Controller, HttpCode, Req, Get, Param } from '@nestjs/common';
import { Roles } from '../../common/enums/roles.enum';
import { Auth } from '../../common/decorators/guard.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CandidateService } from './candidate.service';

@Controller('candidate')
@ApiTags('Common - CandidateAPI')
@ApiBearerAuth()
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Get(':id')
  @Auth(Roles.Admin, Roles.User)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get candidate details' })
  getDetails(@Param('id') id: number, @Req() req: any) {
    return this.candidateService.getDetails(id, req);
  }
}
