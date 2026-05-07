import { Module } from '@nestjs/common';
import { RequestUpdateService } from './request-update.service';
import { RequestUpdateController } from './request-update.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestUpdate } from '../../database/entities';
import CheckPermission from '../../common/module/checkPermission';

@Module({
  imports: [TypeOrmModule.forFeature([RequestUpdate])],
  controllers: [RequestUpdateController],
  providers: [RequestUpdateService, CheckPermission],
  exports: [RequestUpdateService]
})
export class RequestUpdateModule {}
