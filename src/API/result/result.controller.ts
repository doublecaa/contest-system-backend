import { Controller, HttpCode, Req, Get, Query, Param } from '@nestjs/common';
import { Roles } from '../../common/enums/roles.enum';
import { Auth } from '../../common/decorators/guard.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterResultDto } from './dto';
import { ResultService } from './result.service';

@Controller('result')
@ApiTags('Common - ResultAPI')
@ApiBearerAuth()
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Get()
  @Auth(Roles.Admin, Roles.User)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get list result' })
  getList(@Query() params: FilterResultDto, @Req() req: any) {
    return this.resultService.getList(params, req);
  }

  @Get(':id')
  @Auth(Roles.Admin, Roles.User)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get result details' })
  getDetails(@Param('id') id: number, @Req() req: any) {
    return this.resultService.getDetails(id, req);
  }
}
