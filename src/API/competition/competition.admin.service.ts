import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Competition } from 'src/database/entities';
import { DataSource, Like, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateCompetitionDto, UpdateCompetitionDto } from './dto';
import { Util } from 'src/common/module/util';
import { AdminBannerService } from '../banner/banner.admin.service';
import CheckPermission from 'src/common/module/checkPermission';
import { RequestUpdateService } from '../request-update/request-update.service';

@Injectable()
export class AdminCompetitionService {
  constructor(
    @InjectRepository(Competition)
    private competitionRepo: Repository<Competition>,
    private checkPermission: CheckPermission,
    private dataSource: DataSource,
    private util: Util,
    private adminBannerService: AdminBannerService,
    private requestUpdateService: RequestUpdateService
  ) { }
  async insert(params: CreateCompetitionDto, req: any) {
    try {
      // Kiểm tra quyền thêm mới cuộc thi
      await this.checkPermission.Check(req.user, 'insert');
      // Kiểm tra các điều kiện sau: Ngày hiện tại < startDateApply < endDateApply < startDateCompetition < endDateCompetition. (Chú thích: < là lớn hơn 1 ngày)
      const today = new Date().toJSON();
      const checkStartDateApply = this.util.compareDate(
        today,
        params.startDateApply,
      );
      if (!checkStartDateApply) {
        throw new Error('startDateApply must be greater than current');
      }
      const checkEndDateAplly = this.util.compareDate(
        params.startDateApply,
        params.endDateApply,
      );
      if (!checkEndDateAplly) {
        throw new Error('endDateApply must be greater than startDateApply');
      }
      const checkStartCompetition = this.util.compareDate(
        params.endDateApply,
        params.startDateCompetition,
      );
      if (!checkStartCompetition) {
        throw new Error(
          'startDateCompetition must be greater than endDateApply',
        );
      }
      const checkEndCompetition = this.util.compareDate(
        params.startDateCompetition,
        params.endDateCompetition,
      );
      if (!checkEndCompetition) {
        throw new Error(
          'endDateCompetition must be greater than startDateCompetition',
        );
      }
      params = { ...params, applyStatus: 'pendingInsert' };
      // Tạo cuộc thi mới trong DB
      const result = await this.competitionRepo.insert(params);
            // tao request
      await this.requestUpdateService.insert(
        {
          content: `admin ${req.user.id} request update competition id ${result.identifiers[0].id}`,
          feedback: '',
          moduleName: 'competition',
          actionName: 'insert',
          idUpdate: result.identifiers[0].id,
        },
        req,
      );
      //Tạo đường dẫn url website cuộc thi: {env.website-url} / {id-cuoc-thi}
      const websiteUrl = `${process.env.URL_WEBSITE}/${result.identifiers[0].id}`;
      this.competitionRepo.update(result.identifiers[0].id, {
        websiteUrl: websiteUrl,
      });
      await this.adminBannerService.createBanner(result.identifiers[0].id);
      // Trả về kết quả
      return result.identifiers[0];
    } catch (e: any) {
      const stack = e.stack;
      e = { ...e, stack: stack };
      if (e.message == 'Cant find category competition') {
        throw new NotFoundException('Cant find category competition');
      } else {
        throw new Error(e.stack.split('\n')[0]);
      }
    }
  }

  async update(id: number, params: UpdateCompetitionDto, req: any) {
    try {
      // Kiểm tra quyền chỉnh sửa cuộc thi
      await this.checkPermission.Check(req.user, 'update');
      const idCheck = await this.competitionRepo.findOne({
        where: { id: id },
      });
      if (!idCheck) {
        throw new NotFoundException(`id ${id} is not exist`);
      }
      // Kiểm tra các điều kiện sau: Ngày hiện tại < startDateApply < endDateApply < startDateCompetition < endDateCompetition. (Chú thích: < là lớn hơn 1 ngày)
      if (
        params.startDateApply ||
        params.endDateApply ||
        params.startDateCompetition ||
        params.endDateCompetition
      ) {
        if (!params.startDateApply) {
          throw new Error('need startDateApply');
        }
        if (!params.endDateApply) {
          throw new Error('need endDateApply');
        }
        if (!params.startDateCompetition) {
          throw new Error('need startDateCompetition');
        }
        if (!params.endDateCompetition) {
          throw new Error('need endDateCompetition');
        }
        const today = new Date().toJSON();
        const checkStartDateApply = this.util.compareDate(
          today,
          params.startDateApply,
        );
        if (!checkStartDateApply) {
          throw new Error('startDateApply must be greater than current');
        }
        const checkEndDateAplly = this.util.compareDate(
          params.startDateApply,
          params.endDateApply,
        );
        if (!checkEndDateAplly) {
          throw new Error('endDateApply must be greater than startDateApply');
        }
        const checkStartCompetition = this.util.compareDate(
          params.endDateApply,
          params.startDateCompetition,
        );
        if (!checkStartCompetition) {
          throw new Error(
            'startDateCompetition must be greater than endDateApply',
          );
        }
        const checkEndCompetition = this.util.compareDate(
          params.startDateCompetition,
          params.endDateCompetition,
        );
        if (!checkEndCompetition) {
          throw new Error(
            'endDateCompetition must be greater than startDateCompetition',
          );
        }
      }
      // // Cập nhật cuộc thi trong DB
      const newParams = { ...idCheck };
      delete newParams.id;
      for (const key in params) {
        newParams[key] = params[key];
      }
      newParams.applyStatus = 'pendingUpdate';
      const result = await this.competitionRepo.insert(newParams);
      // Trả về kết quả
      return result;
    } catch (e: any) {
      const stack = e.stack;
      e = { ...e, stack: stack };
      if (e.message == `id ${id} is not exist`) {
        throw new NotFoundException(`id ${id} is not exist`);
      } else if (e.message == 'Cant find category competition') {
        throw new NotFoundException('Cant find category competition');
      } else if (e.message == 'REQUEST_HAS_NOT_BEEN_PROCESSED') {
        throw new ConflictException('REQUEST_HAS_NOT_BEEN_PROCESSED');
      } else {
        throw new Error(e.stack.split('\n')[0]);
      }
    }
  }
  async getAllCompetition(req: any) {
    await this.checkPermission.Check(req.user, 'getList');
    const data = await this.competitionRepo.find({});
    return {
      data: data,
      total: data.length,
    };
  }

  async delete(id: number, req: any) {
    try {
      await this.checkPermission.Check(req.user, 'delete');
      const idCheck = await this.competitionRepo.findOne({ where: { id: id } });
      if (!idCheck) {
        throw new NotFoundException('CANT_FIND_COMPETITION');
      }
      const result = await this.competitionRepo.update(id, {
        applyStatus: 'pendingDelete',
      });
      return result;
    } catch (e: any) {
      const stack = e.stack;
      e = { ...e, stack: stack };
      if (e.message == 'CANT_FIND_COMPETITION') {
        throw new NotFoundException('CANT_FIND_COMPETITION');
      } else {
        throw new Error(e.stack.split('\n')[0]);
      }
    }
  }
}
