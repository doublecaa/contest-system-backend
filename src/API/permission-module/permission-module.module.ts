import { Module } from '@nestjs/common';
import { PermissionModuleService } from './permission-module.service';
import { PermissionModuleController } from './permission-module.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionModule } from 'src/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionModule])],
  controllers: [PermissionModuleController],
  providers: [PermissionModuleService],
})
export class PermissionModuleModule {}
