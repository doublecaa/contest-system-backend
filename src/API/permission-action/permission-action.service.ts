import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository, Like } from 'typeorm';
import { PermissionAction } from '../../database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterPermissionDto, UpdatePermissionDto } from './dto';

@Injectable()
export class PermissionActionService {
  constructor(
    @InjectRepository(PermissionAction)
    private permissionRepo: Repository<PermissionAction>,
  ) {}
  async getList(params: FilterPermissionDto) {
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
      const data = await this.permissionRepo.find({
        where: filter,
        select: {
          id: true,
          code: true,
          description: true,
        },
        skip: skip || 0,
        take: take || 20,
        order: order,
      });
      const total = await this.permissionRepo.count({
        where: filter,
        order: order,
      });
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

  async getDetails(id: number) {
    try {
      const result = await this.permissionRepo.findOne({ where: { id: id } });
      return result;
    } catch (e: any) {
      const stack = e.stack;
      e = { ...e, stack: stack };
      throw new Error(e.stack.split('\n')[0]);
    }
  }

  async update(id: number, params: UpdatePermissionDto) {
    try {
      const idCheck = await this.permissionRepo.findOne({
        where: { id: id },
      });
      if (!idCheck) {
        throw new NotFoundException(`id ${id} is not exist`);
      }
      const result = await this.permissionRepo.update(id, params);
      return result;
    } catch (e: any) {
      const stack = e.stack;
      e = { ...e, stack: stack };
      if (e.message == `id ${id} is not exist`) {
        throw new NotFoundException(`id ${id} is not exist`);
      } else {
        throw new Error(e.stack.split('\n')[0]);
      }
    }
  }
}
