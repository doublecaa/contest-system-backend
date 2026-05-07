import {
  Controller,
  Body,
  HttpCode,
  Req,
  Get,
  Query,
  Param,
  Put,
} from '@nestjs/common';
import { Roles } from '../../common/enums/roles.enum';
import { Auth } from '../../common/decorators/guard.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterCandidateDto, UpdateCandidateDto } from './dto';
import { AdminCandidateService } from './candidate.admin.service';

@Controller('candidate')
@ApiTags('Admin - CandidateAPI')
@ApiBearerAuth()
export class AdminCandidateController {
  constructor(private readonly candidateService: AdminCandidateService) {}

  @Get()
  @Auth(Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin get list candidate' })
  adminGetList(@Query() params: FilterCandidateDto, @Req() req: any) {
    return this.candidateService.adminGetList(params, req);
  }

  @Put(':id')
  @Auth(Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin update candidate' })
  adminUpdate(
    @Param('id') id: number,
    @Body() params: UpdateCandidateDto,
    @Req() req: any,
  ) {
    return this.candidateService.adminUpdate(id, params, req);
  }
}
