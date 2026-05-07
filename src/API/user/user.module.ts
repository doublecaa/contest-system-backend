import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { JwtModule } from '@nestjs/jwt';
import { AdminUserController } from './user.admin.controller';
import { AdminUserService } from './user.admin.service';
import CheckPermission from 'src/common/module/checkPermission';
import { UploadImageModule } from '../upload-image/upload-image.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule, UploadImageModule],
  controllers: [UserController, AdminUserController],
  providers: [UserService, AdminUserService, CheckPermission],
})
export class UserModule { }
