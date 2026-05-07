import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { Role } from '../../database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  CreateRoleDto,
  FilterRoleDto,
  UpdateRoleDto,
} from './dto';
import CheckPermission from 'src/common/module/checkPermission';

@Injectable()
export class RoleService {
constructor(
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    private checkPermission: CheckPermission,
  ) {}
  async getList(params: FilterRoleDto, req: any) {
    try {
      // Kiểm tra quyền xem danh sách role
      await this.checkPermission.Check(req.user, 'getList');
      // Lấy danh sách vai trò trong DB
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

      const data = await this.roleRepo.find({
        where: filter,
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          admins: {
            id: true,
            name: true,
            email: true,
          },
        },
        relations: {
          admins: true,
        },
        skip: skip || 0,
        take: take || 20,
        order: order,
      });
      const total = await this.roleRepo.count({
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
      // await this.checkPermission.Check(req.user, 'getDetails');
      const result = await this.roleRepo.findOne({
        where: { id: id },
        select: {
          admins: {
            id: true,
            name: true,
            email: true,
          },
        },
        relations: {
          admins: true,
        },
      });
      if (!result) {
        throw new NotFoundException(`id ${id} is not exist`);
      }
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
  async insert(params: CreateRoleDto, req: any) {
    try {
      // Kiểm tra quyền tạo role
      await this.checkPermission.Check(req.user, 'insert');
      // Kiểm tra tên quyền có tồn tại trong DB
      const checkExist = await this.roleRepo.findOne({
        where: { name: params.name },
      });
      if (checkExist) {
        throw new ConflictException(`${params.name} already exist`);
      }
      // Tạo vai trò mới trong DB
      const result = await this.roleRepo.insert(params);
      // Trả về kết quả
      return result.identifiers[0];
    } catch (e: any) {
      const stack = e.stack;
      e = { ...e, stack: stack };
      if (e.message == `${params.name} already exist`) {
        throw new ConflictException(`${params.name} already exist`);
      } else {
        throw new Error(e.stack.split('\n')[0]);
      }
    }
  }
  async update(id: number, params: UpdateRoleDto, req: any) {
    try {
      // Kiểm tra quyền chỉnh sửa role
      await this.checkPermission.Check(req.user, 'update');
      // Kiểm tra id vai trò có tồn tại
      const roleCheck = await this.roleRepo.findOne({
        where: { id: id },
      });
      if (!roleCheck) {
        throw new NotFoundException(`id ${id} is not exist`);
      }
      // Cập nhật vai trò trong DB
      const result = await this.roleRepo.update(id, params);
      // Trả về kết quả
      return result;
    } catch (e: any) {
      const stack = e.stack;
      e = { ...e, stack: stack };
      // logger.error(JSON.stringify(e));
      if (e.message == `id ${id} is not exist`) {
        throw new NotFoundException(`id ${id} is not exist`);
      } else {
        throw new Error(e.stack.split('\n')[0]);
      }
    }
  }
  async delete(id: number, req: any) {
    try {
      // Kiểm tra quyền xoá role
      await this.checkPermission.Check(req.user, 'delete');
      // Kiểm tra id vai trò có tồn tại
      const roleCheck = await this.roleRepo.findOne({
        where: { id: id },
      });
      if (!roleCheck) {
        throw new NotFoundException(`id ${id} is not exist`);
      }
      // Xoá vai trò trong DB
      const result = await this.roleRepo.delete(id);
      // Trả về kết quả
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
