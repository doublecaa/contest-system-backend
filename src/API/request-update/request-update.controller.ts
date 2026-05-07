import {
  Controller,
  Get,
  HttpCode,
  Req,
  Query,
  Param,
  Post,
  Put,
  Body,
} from '@nestjs/common';
import { RequestUpdateService } from './request-update.service';
import { Auth } from '../../common/decorators/guard.decorator';
import { Roles } from '../../common/enums/roles.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateRequestUpdateDto,
  FilterRequestUpdateDto,
  UpdateRequestUpdateDto,
} from './dto';

@Controller('request-update')
@ApiTags('Admin - RequestUpdate')
@ApiBearerAuth()
export class RequestUpdateController {
  constructor(private readonly requestUpdateService: RequestUpdateService) {}

  @Get()
  @Auth(Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin get request update list' })
  getList(@Query() params: FilterRequestUpdateDto, @Req() req: any) {
    return this.requestUpdateService.getList(params, req);
  }

  @Get(':id')
  @Auth(Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin get request update details' })
  getDetails(@Param('id') id: number, @Req() req: any) {
    return this.requestUpdateService.getDetails(id, req);
  }

  @Post()
  @Auth(Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin insert request update' })
  insert(@Body() params: CreateRequestUpdateDto, @Req() req: any) {
    return this.requestUpdateService.insert(params, req);
  }

  @Put(':id')
  @Auth(Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin update request update' })
  update(
    @Param('id') id: number,
    @Body() params: UpdateRequestUpdateDto,
    @Req() req: any,
  ) {
    return this.requestUpdateService.update(id, params, req);
  }
}
