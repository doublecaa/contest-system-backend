import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Put, Query } from '@nestjs/common';
import { PermissionActionService } from './permission-action.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/enums/roles.enum';
import { Auth } from '../../common/decorators/guard.decorator';
import { FilterPermissionDto, UpdatePermissionDto } from './dto';

@Controller('permission-action')
@ApiTags('Admin - PermissionActionAPI')
@ApiBearerAuth()
export class PermissionActionController {
  constructor(private readonly permissionActionService: PermissionActionService) {}


  @Get()
  @Auth(Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin get list permission action' })
  getList(@Query() params: FilterPermissionDto) {
    return this.permissionActionService.getList(params);
  }

  @Get(':id')
  @Auth(Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin get permission action details' })
  getDetails(@Param('id') id: number) {
    return this.permissionActionService.getDetails(id);
  }

  @Put(':id')
  @Auth(Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin update permission action' })
  update(
    @Param('id') id: number,
    @Body() params: UpdatePermissionDto,
  ) {
    return this.permissionActionService.update(id, params);
  }
}
