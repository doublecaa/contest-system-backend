import { Module } from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { CompetitionController } from './competition.controller';
import { AdminCompetitionService } from './competition.admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competition } from 'src/database/entities';
import { Util } from 'src/common/module/util';
import { AdminCompetitionController } from './competition.admin.controller';
import { BannerModule } from '../banner/banner.module';
import CheckPermission from 'src/common/module/checkPermission';
import { RequestUpdateModule } from '../request-update/request-update.module';

@Module({
  imports: [TypeOrmModule.forFeature([Competition]), BannerModule, RequestUpdateModule],
  controllers: [CompetitionController, AdminCompetitionController],
  providers: [CompetitionService, AdminCompetitionService, CheckPermission, Util],
})
export class CompetitionModule { }
