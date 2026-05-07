import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Competition } from 'src/database/entities';
import { Like, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { FilterCompetitionDto } from './dto';
import CheckPermission from 'src/common/module/checkPermission';

@Injectable()
export class CompetitionService {
  constructor(
    @InjectRepository(Competition)
    private competitionRepo: Repository<Competition>,
    private checkPermission: CheckPermission,
  ) { }
  async getList(params: FilterCompetitionDto, req: any) {
    try {
      if (req.user.role == 'admin') {
        // Kiểm tra quyền xem danh sách cuộc thi
        await this.checkPermission.Check(req.user, 'getList');
      }
      let filter = {};
      const skip = params.skip;
      const take = params.take;
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
      for (const key in params) {
        filter[key] = Like(`%${params[key]}%`);
      }
      filter = { ...filter, applyStatus: 'applied' };
      // Lấy danh sách cuộc thi trong DB
      const data = await this.competitionRepo.find({
        where: filter,
        skip: skip || 0,
        take: take || 20,
        order: order,
      });
      const total = await this.competitionRepo.count({
        where: filter,
        order: order,
      });
      // Trả kết quả
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
      if (req.user.role == 'admin') {
        // Kiểm tra quyền xem chi tiết cuộc thi
        await this.checkPermission.Check(req.user, 'getDetails');
      }
      // Lấy chi tiết cuộc thi trong DB bằng competition id
      const result = await this.competitionRepo.findOne({
        where: { id: id },
      });
      if (!result) {
        throw new NotFoundException(`id ${id} is not exist`);
      }
      // Trả kết quả
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
