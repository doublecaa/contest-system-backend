import { Controller, HttpCode, Req, Param, Get, Query } from '@nestjs/common';
import { Roles } from '../../common/enums/roles.enum';
import { Auth } from '../../common/decorators/guard.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterBannerDto } from './dto';
import { BannerService } from './banner.service';

@Controller('banner')
@ApiBearerAuth()
@ApiTags('Admin - BannerAPI')
export class AdminBannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  @Auth(Roles.Admin, Roles.User)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin get list banner' })
  getList(@Query() params: FilterBannerDto, @Req() req: any) {
    return this.bannerService.getList(params, req);
  }

  @Get(':id')
  @Auth(Roles.Admin, Roles.User)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin get banner details' })
  getDetails(@Param('id') id: number, @Req() req: any) {
    return this.bannerService.getDetails(id, req);
  }
}
