import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Query,
  Param,
  Put,
} from '@nestjs/common';
import { PermissionModuleService } from './permission-module.service';
import { Roles } from '../../common/enums/roles.enum';
import { Auth } from '../../common/decorators/guard.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  FilterPermissionModuleDto,
  UpdatePermissionModuleDto,
} from './dto';

@Controller('permission-module')
@ApiBearerAuth()
@ApiTags('Admin - PermissionModuleAPI')
export class PermissionModuleController {
  constructor(
    private readonly permissionModuleService: PermissionModuleService,
  ) {}
  @Get()
  @Auth(Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin get list permission module' })
  getList(@Query() params: FilterPermissionModuleDto) {
    return this.permissionModuleService.getList(params);
  }

  @Post(':id')
  @Auth(Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin get permission module details' })
  getDetails(@Param('id') id: number) {
    return this.permissionModuleService.getDetails(id);
  }

  @Put(':id')
  @Auth(Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin update permission module' })
  update(
    @Param('id') id: number,
    @Body() params: UpdatePermissionModuleDto,
  ) {
    return this.permissionModuleService.update(id, params);
  }
}
