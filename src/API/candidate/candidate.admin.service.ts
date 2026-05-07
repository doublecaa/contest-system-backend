import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { FilterCandidateDto, UpdateCandidateDto } from './dto';
import { Candidate, Competition } from '../../database/entities';
import CheckPermission from 'src/common/module/checkPermission';

@Injectable()
export class AdminCandidateService {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepo: Repository<Candidate>,
    private checkPermission: CheckPermission,
    private dataSource: DataSource,
  ) {}
  async adminGetList(params: FilterCandidateDto, req: any) {
    try {
      // Kiểm tra quyền xem danh sách thí sinh
      await this.checkPermission.Check(req.user, 'getList');
      // Kiểm tra id cuộc thi có tồn tại (nếu có)
      if (params.competitionId) {
        const checkCompetition = await this.dataSource
          .getRepository(Competition)
          .findOne({ where: { id: params.competitionId } });
        if (!checkCompetition) {
          throw new NotFoundException('Cant find competition');
        }
      }
      // Filter danh sách thí sinh trong DB dựa vào id cuộc thi, nếu không có id cuộc thi thì lấy tất cả danh sách thí sinh
      let filter = {};
      const skip = params.skip;
      const take = params.take;
      const name = params.name;
      const identificationNumber = params.identificationNumber;
      const competitionId = params.competitionId;
      const order = {};
      let key = 'createdAt';
      let value = 'desc';
      if (params.key && params.value) {
        key = params.key;
        value = params.value;
      }
      order[key] = value;
      delete params.skip;
      delete params.take;
      delete params.key;
      delete params.value;
      delete params.name;
      delete params.identificationNumber;
      delete params.competitionId;
      for (const key in params) {
        filter[key] = Like(`%${params[key]}%`);
      }
      if (name) {
        filter = { ...filter, user: { name: Like(`%${name}%`) } };
      }
      if (identificationNumber) {
        filter = {
          ...filter,
          user: { identificationNumber: identificationNumber },
        };
      }
      if (competitionId) {
        filter = {
          ...filter,
          competition: { id: competitionId },
        };
      }
      const data = await this.candidateRepo.find({
        where: filter,
        select: {
          user: {
            name: true,
            avatarUrl: true,
          },
          competition: {
            id: true,
            title: true,
            status: true,
          },
        },
        relations: {
          user: true,
          competition: true,
        },
        skip: skip || 0,
        take: take || 20,
        order: order,
      });
      const total = await this.candidateRepo.count({
        where: filter,
        order: order,
      });
      // Trả về kết quả
      return {
        data: data,
        total: total,
      };
    } catch (e: any) {
      const stack = e.stack;
      e = { ...e, stack: stack };
      if (e.message == 'Cant find competition') {
        throw new NotFoundException(e.message);
      } else {
        throw new Error(e.stack.split('\n')[0]);
      }
    }
  }

  async adminUpdate(id: number, params: UpdateCandidateDto, req: any) {
    try {
      // Kiểm tra quyền chỉnh sửa thí sinh
      await this.checkPermission.Check(req.user, 'update');
      // Kiểm tra id thí sinh có tồn tại không
      const idCheck = await this.candidateRepo.findOne({
        where: { id: id },
      });
      if (!idCheck) {
        throw new NotFoundException(`id ${id} is not exist`);
      }
      // Cập nhật thí sinh trong DB
      const result = await this.candidateRepo.update(id, params);
      // Trả về kết quả
      return result;
    } catch (e: any) {
      const stack = e.stack;
      e = { ...e, stack: stack };
      if (e.message == `id ${id} is not exist`) {
        throw new NotFoundException(e.message);
      } else {
        throw new Error(e.stack.split('\n')[0]);
      }
    }
  }
}
