import { Module } from '@nestjs/common';
import { PermissionActionService } from './permission-action.service';
import { PermissionActionController } from './permission-action.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionAction } from 'src/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionAction])],
  controllers: [PermissionActionController],
  providers: [PermissionActionService],
})
export class PermissionActionModule {}
