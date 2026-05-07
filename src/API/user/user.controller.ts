import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Req, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/guard.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { UpdateUserDto } from './dto';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User - UserAPI')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login User' })
  login(@Body() params: LoginUserDto) {
    return this.userService.login(params)
  }

  @Public()
  @Post('register')
  @HttpCode(200)
  @ApiOperation({ summary: 'Register User' })
  register(@Body() params: CreateUserDto) {
    return this.userService.register(params)
  }

  @Get(':id')
  @Auth(Roles.User, Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get user defails' })
  getDetails(@Param('id') id: number, @Req() req: any) {
    return this.userService.getDetails(id, req);
  }

  @Put(':id')
  @Auth(Roles.User, Roles.Admin)
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin/User update user info' })
  update(
    @Param('id') id: number,
    @Body() params: UpdateUserDto,
    @Req() req: any,
  ) {
    return this.userService.updateUser(id, params, req);
  }
}
