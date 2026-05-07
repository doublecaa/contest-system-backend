import {
  Controller,
  Post,
  Body,
  HttpCode,
  Req,
  Get,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { Auth } from '../../common/decorators/guard.decorator';
import { Roles } from '../../common/enums/roles.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateRoleDto,
  FilterRoleDto,
  UpdateRoleDto,
} from './dto';

@Controller('role')
@ApiTags('Admin - RoleAPI')
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Auth(Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin get role list' })
  getList(@Query() params: FilterRoleDto, @Req() req: any) {
    return this.roleService.getList(params, req);
  }

  @Get(':id')
  @Auth(Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin get role details' })
  getDetails(@Param('id') id: number, @Req() req: any) {
    return this.roleService.getDetails(id, req);
  }

  @Post()
  @Auth(Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin insert role' })
  insert(@Body() params: CreateRoleDto, @Req() req: any) {
    return this.roleService.insert(params, req);
  }

  @Put(':id')
  @Auth(Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin update role' })
  update(
    @Param('id') id: number,
    @Body() params: UpdateRoleDto,
    @Req() req: any,
  ) {
    return this.roleService.update(id, params, req);
  }

  @Delete(':id')
  @Auth(Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin delete role' })
  delete(@Param('id') id: number, @Req() req: any) {
    return this.roleService.delete(id, req);
  }
}
