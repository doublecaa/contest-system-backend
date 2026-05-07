import { Module } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { CandidateController } from './candidate.controller';
import { Candidate } from '../../database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCandidateController } from './candidate.admin.controller';
import { AdminCandidateService } from './candidate.admin.service';
import CheckPermission from 'src/common/module/checkPermission';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate])],
  controllers: [CandidateController, AdminCandidateController],
  providers: [CandidateService, AdminCandidateService, CheckPermission],
})
export class CandidateModule {}
