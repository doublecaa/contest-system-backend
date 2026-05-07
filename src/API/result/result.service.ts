import { Injectable } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { FilterResultDto } from './dto';
import { Result } from '../../database/entities';
import CheckPermission from 'src/common/module/checkPermission';

@Injectable()
export class ResultService {
  constructor(
    @InjectRepository(Result)
    private resultRepo: Repository<Result>,
    private checkPermission: CheckPermission,
  ) {}
  async getList(params: FilterResultDto, req: any) {
    try {
      if (req.user.role == 'admin') {
        // Kiểm tra quyền xem danh sách result
        await this.checkPermission.Check(req.user, 'getList');
      }
      // Lấy danh sách result theo filter trong DB
      let filter = {};
      const skip = params.skip;
      const take = params.take;
      const name = params.name;
      const identificationNumber = params.identificationNumber;
      const competitionId = params.competitionId;
      const order = {};
      let key = 'createdAt';
      let value = 'desc';
      if (params.value && params.key) {
        key = params.key;
        value = params.value;
      }
      order[key] = value;
      delete params.skip;
      delete params.take;
      delete params.value;
      delete params.key;
      delete params.identificationNumber;
      delete params.competitionId;
      delete params.name;
      for (const key in params) {
        filter[key] = Like(`%${params[key]}%`);
      }
      if (identificationNumber) {
        filter = {
          ...filter,
          candidate: {
            user: { identificationNumber: Like(`%${identificationNumber}%`) },
          },
        };
      } else {
        if (name) {
          filter = {
            ...filter,
            candidate: { user: { name: Like(`%${name}%`) } },
          };
        }
      }
      if (competitionId) {
        filter = {
          ...filter,
          candidate: { competitionId: Like(`%${competitionId}%`) },
        };
      }
      const data = await this.resultRepo.find({
        where: filter,
        select: {
          candidate: {
            id: true,
            user: {
              id: true,
              name: true,
            },
          },
        },
        relations: ['candidate', 'candidate.user'],
        skip: skip || 0,
        take: take || 20,
        order: order,
      });
      const total = await this.resultRepo.count({
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
      throw new Error(e.stack.split('\n')[0]);
    }
  }
  async getDetails(id: number, req: any) {
    try {
      // Lấy chi tiết result từ DB
      const result = await this.resultRepo.findOne({ where: { id: id } });
      // Trả về kết quả
      return result;
    } catch (e: any) {
      const stack = e.stack;
      e = { ...e, stack: stack };
      throw new Error(e.stack.split('\n')[0]);
    }
  }
}
