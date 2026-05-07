import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  FilterPermissionModuleDto,
  UpdatePermissionModuleDto,
} from './dto';
import { PermissionModule } from '../../database/entities';

@Injectable()
export class PermissionModuleService {
  constructor(
    @InjectRepository(PermissionModule)
    private permissionModuleRepo: Repository<PermissionModule>,
  ) { }
  async getList(params: FilterPermissionModuleDto) {
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
      const data = await this.permissionModuleRepo.find({
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
      const total = await this.permissionModuleRepo.count({
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
      const result = await this.permissionModuleRepo.findOne({
        where: { id: id },
      });
      return result;
    } catch (e: any) {
      const stack = e.stack;
      e = { ...e, stack: stack };
      throw new Error(e.stack.split('\n')[0]);
    }
  }
  async update(id: number, params: UpdatePermissionModuleDto) {
    try {
      const idCheck = await this.permissionModuleRepo.findOne({
        where: { id: id },
      });
      if (!idCheck) {
        throw new NotFoundException(`id ${id} is not exist`);
      }
      const result = await this.permissionModuleRepo.update(id, params);
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
