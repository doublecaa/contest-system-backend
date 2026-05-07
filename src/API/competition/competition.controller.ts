import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, Req } from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { Roles } from '../../common/enums/roles.enum';
import { Auth } from '../../common/decorators/guard.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterCompetitionDto } from './dto';

@Controller('competition')
@ApiBearerAuth()
@ApiTags('Common - CompetitionAPI')
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Get()
  @Auth(Roles.Admin, Roles.User)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get list competition' })
  getList(@Req() req: any, @Query() params: FilterCompetitionDto) {
    return this.competitionService.getList(params, req);
  }

  @Get(':id')
  @Auth(Roles.Admin, Roles.User)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get competition details' })
  getDetails(@Param('id') id: number, @Req() req: any) {
    return this.competitionService.getDetails(id, req);
  }
}
