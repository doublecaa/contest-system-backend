import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, Repository } from 'typeorm';
import { FilterBannerDto } from './dto';
import { Banner, Competition } from 'src/database/entities';
import CheckPermission from 'src/common/module/checkPermission';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private bannerRepo: Repository<Banner>,
    private checkPermission: CheckPermission,
    private dataSource: DataSource,
  ) { }
  async getList(params: FilterBannerDto, req: any) {
    try {
      if (req.user.role == 'admin') {
        // Kiểm tra quyền xem danh sách banner
        await this.checkPermission.Check(req.user, 'getList');
      }
      // Kiểm tra id cuộc thi có tồn tại (nếu có)
      if (params.competitionId) {
        const checkCompetition = await this.dataSource
          .getRepository(Competition)
          .findOne({
            where: { id: params.competitionId },
          });
        if (!checkCompetition) {
          throw new NotFoundException('cant find competition');
        }
      }
      // Filter danh sách banner trong DB dựa vào id cuộc thi, nếu không có id cuộc thi thì lấy tất cả danh sách
      let filter = {};
      const skip = params.skip;
      const take = params.take;
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
      delete params.competitionId;
      for (const key in params) {
        filter[key] = Like(`%${params[key]}%`);
      }
      if (competitionId) {
        filter = { ...filter, competition: { id: Like(`%${competitionId}%`) } };
      }
      const data = await this.bannerRepo.find({
        where: filter,
        relations: {
          competition: true,
        },
        skip: skip || 0,
        take: take || 20,
        order: order,
      });
      const total = await this.bannerRepo.count({
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
      if (e.message == 'cant find competition') {
        throw new NotFoundException(e.message);
      } else {
        throw new Error(e.stack.split('\n')[0]);
      }
    }
  }

  async getDetails(id: number, req: any) {
    try {
      if (req.user.role == 'admin') {
        // Kiểm tra quyền xem chi tiết banner
        await this.checkPermission.Check(req.user, 'getDetails');
      }
      // Lấy chi tiết banner trong DB
      const result = await this.bannerRepo.findOne({
        where: { id: id },
        relations: {
          competition: true,
        },
      });
      if (!result) {
        throw new NotFoundException(`id ${id} is not exist`);
      }
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
