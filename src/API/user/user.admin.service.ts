import { Injectable } from '@nestjs/common';
import { AdminFilterDto } from './dto/admin-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { Like, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) { }
  async getList(params: AdminFilterDto, req: any) {
    try {
      const filter = {};
            const skip = params.skip;
            const take = params.take;
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
            for (const key in params) {
              filter[key] = Like(`%${params[key]}%`);
            }
            // Lấy danh sách nhân viên kèm filter trong DB
            const data = await this.userRepo.find({
              where: filter,
              select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
              },
              skip: skip || 0,
              take: take || 20,
              order: order,
            });
            const total = await this.userRepo.count({
              where: filter,
              order: order,
            });
            const result = {
              data: data,
              total: total,
            };
            // Trả kết quả
            return result;
    } catch (error: any) {
      throw new Error(error.stack.split('\n')[0]);

    }
  }

}
