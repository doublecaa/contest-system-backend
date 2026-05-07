import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/database/entities';
import { JwtModule } from '@nestjs/jwt';
import CheckPermission from 'src/common/module/checkPermission';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), JwtModule],
  controllers: [AdminController],
  providers: [AdminService, CheckPermission],
})
export class AdminModule { }
