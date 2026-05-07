import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminBannerController } from './banner.admin.controller';
import { AdminBannerService } from './banner.admin.service';
import { Banner } from 'src/database/entities';
import { UploadImageModule } from '../upload-image/upload-image.module';
import CheckPermission from 'src/common/module/checkPermission';

@Module({
  imports: [TypeOrmModule.forFeature([Banner]), UploadImageModule],
  controllers: [BannerController, AdminBannerController],
  providers: [BannerService, AdminBannerService, CheckPermission],
  exports: [AdminBannerService]
})
export class BannerModule { }
