import { Controller, Get, Post, Body, HttpCode, Query, Req, Put, Param, Delete, Headers } from '@nestjs/common';
import { LoginAdminDto, AdminFilterDto, ChangePasswordDto, ResetPasswordDto, UpdateAdminDto, CreateAdminDto } from './dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/guard.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { AdminService } from './admin.service';

@Controller('admin')
@ApiBearerAuth()
@ApiTags('Admin - AdminAPI')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login admin' })
  login(@Body() params: LoginAdminDto) {
    return this.adminService.login(params);
  }

  @Put('changePassword')
  @HttpCode(200)
  @Auth(Roles.Admin)
  @ApiOperation({ summary: 'Change password admin' })
  changePassword(@Body() params: ChangePasswordDto, @Req() req: any) {
    return this.adminService.changePassword(params, req);
  }

  @Public()
  @Post('resetPassword')
  @HttpCode(200)
  @Auth(Roles.Admin)
  @ApiOperation({ summary: 'admin request reset password' })
  resetPassword(@Body() params: ResetPasswordDto) {
    return this.adminService.resetPassword(params);
  }

  @Public()
  @Post('logoutAdmin')
  @Auth(Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Logout Admin' })
  logoutAdmin(@Headers() header: any) {
    return this.adminService.logout(header);
  }

  @Get()
  @HttpCode(200)
  @Auth(Roles.Admin)
  @ApiOperation({ summary: 'Get list of admins' })
  getList(@Query() params: AdminFilterDto, @Req() req: any) {
    return this.adminService.getList(params, req);
  }

  @Get('/:id')
  @HttpCode(200)
  @Auth(Roles.Admin)
  @ApiOperation({ summary: 'Get defails of admin' })
  getDetails(@Param('id') id: number, @Req() req: any) {
    return this.adminService.getDetails(id, req);
  }

  @Put('/:id')
  @HttpCode(200)
  @Auth(Roles.Admin)
  @ApiOperation({ summary: 'Update admin info' })
  updateById(
    @Param('id') id: number,
    @Body() params: UpdateAdminDto,
    @Req() req: any,
  ) {
    return this.adminService.updateById(id, params, req);
  }

  @Post()
  @HttpCode(200)
  @Auth(Roles.Admin)
  @ApiOperation({ summary: 'create new admin' })
  create(@Body() params: CreateAdminDto, @Req() req: any) {
    return this.adminService.create(params, req);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth(Roles.Admin)
  @ApiOperation({ summary: 'delete admin' })
  adminDelete(@Param('id') id: number, @Req() req: any) {
    return this.adminService.delete(id, req);
  }
}
