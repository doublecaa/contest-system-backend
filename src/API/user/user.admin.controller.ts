import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, Req } from '@nestjs/common';
import { AdminUserService } from './user.admin.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/guard.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { AdminFilterDto } from './dto';

@Controller('user')
@ApiBearerAuth()
@ApiTags('Admin - UserAPI')
export class AdminUserController {
  constructor(private readonly userService: AdminUserService) { }

  @Get()
  @HttpCode(200)
  @Auth(Roles.Admin)
  @ApiOperation({ summary: 'Admin get list of users' })
  getList(@Query() params: AdminFilterDto, @Req() req: any) {
    return this.userService.getList(params, req);
  }
}
