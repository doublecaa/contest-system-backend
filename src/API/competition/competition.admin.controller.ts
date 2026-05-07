import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, Req, Put } from '@nestjs/common';
import { Roles } from '../../common/enums/roles.enum';
import { Auth } from '../../common/decorators/guard.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCompetitionDto, UpdateCompetitionDto } from './dto';
import { AdminCompetitionService } from './competition.admin.service';

@Controller('competition')
@ApiBearerAuth()
@ApiTags('Admin - CompetitionAPI')
export class AdminCompetitionController {
  constructor(private readonly competitionService: AdminCompetitionService) {}

  @Post()
  @Auth(Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin insert competition' })
  adminInsert(@Body() params: CreateCompetitionDto, @Req() req: any) {
    return this.competitionService.insert(params, req);
  }

  @Put(':id')
  @Auth(Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin update competition' })
  adminUpdate(
    @Param('id') id: number,
    @Body() params: UpdateCompetitionDto,
    @Req() req: any,
  ) {
    return this.competitionService.update(id, params, req);
  }

  @Get('list/all')
  @Auth(Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin get all competition' })
  adminGetAllCompetition(@Req() req: any) {
    return this.competitionService.getAllCompetition(req);
  }
  @Delete(':id')
  @Auth(Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin delete competition' })
  adminDelete(@Param('id') id: number, @Req() req: any) {
    return this.competitionService.delete(id, req);
  }
}
