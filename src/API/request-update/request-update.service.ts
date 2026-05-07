import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, Like, DataSource } from 'typeorm';
import { RequestUpdate } from '../../database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import CheckPermission from '../../common/module/checkPermission';
import {
  CreateRequestUpdateDto,
  FilterRequestUpdateDto,
  UpdateRequestUpdateDto,
} from './dto';
import { Status } from 'src/common/enums/status.enum';

@Injectable()
export class RequestUpdateService {
constructor(
    @InjectRepository(RequestUpdate)
    private requestUpdateRepo: Repository<RequestUpdate>,
    private checkPermission: CheckPermission,
    private dataSource: DataSource,
  ) {}
  async getList(params: FilterRequestUpdateDto, req: any) {
    try {
      // Kiểm tra quyền xem danh sách request-update
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
        if (key == 'adminId') {
          filter[key] = params[key];
        } else {
          filter[key] = Like(`%${params[key]}%`);
        }
      }

      const data = await this.requestUpdateRepo.find({
        where: filter,
        skip: skip || 0,
        take: take || 20,
        order: order,
      });
      const total = await this.requestUpdateRepo.count({
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
      await this.checkPermission.Check(req.user, 'getDetails');
      const result = await this.requestUpdateRepo.findOne({
        where: { id: id },
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

  async insert(params: CreateRequestUpdateDto, req: any) {
    try {
      await this.checkPermission.Check(req.user, 'insert');
      let filter: any = [
        {
          moduleName: params.moduleName,
          idUpdate: params.idUpdate,
          status: Status.Wait,
        },
        {
          moduleName: params.moduleName,
          idUpdate: params.idUpdate,
          status: Status.Return,
        },
      ];
      if (params.actionName == 'insert') {
        filter = {};
      }
      const checkRequest = await this.requestUpdateRepo.findOne({
        where: filter,
        order: {
          createdAt: 'desc',
        },
      });
      if (checkRequest && params.actionName !== 'insert') {
        throw new ConflictException('REQUEST_HAS_NOT_BEEN_PROCESSED');
      }
      const paramsInsert = { ...params, adminId: req.user.id };
      const request = await this.requestUpdateRepo.insert(paramsInsert);
      return { id: request.identifiers[0].id };
    } catch (e: any) {
      const stack = e.stack;
      e = { ...e, stack: stack };
      if (e.message == 'REQUEST_HAS_NOT_BEEN_PROCESSED') {
        throw new ConflictException('REQUEST_HAS_NOT_BEEN_PROCESSED');
      } else {
        throw new Error(e.stack.split('\n')[0]);
      }
    }
  }

  async update(
    id: number,
    params: UpdateRequestUpdateDto,
    req: any,
  ) {
    try {
      // Kiểm tra quyền thao tác đến request-update
      await this.checkPermission.Check(req.user, 'update');
      // Kiểm tra admin có quyền review module 
      await this.checkPermission.CheckModuleAction(req.user, params.moduleName, 'review')
      const checkRequest = await this.requestUpdateRepo.findOne({
        where: { id: id },
      });
      if (!checkRequest) {
        throw new NotFoundException('REQUEST_UPDATE_NOT_FOUND');
      }
      // Lấy entity từ moduleName
      let entityName = '';
      const moduleNameArr = checkRequest.moduleName.split('-');
      for (const key in moduleNameArr) {
        const temp =
          moduleNameArr[key].charAt(0).toUpperCase() +
          moduleNameArr[key].slice(1);
        entityName = entityName + temp;
      }
      //
      if (params.actionName == 'update') {
        // Lấy item đang trong trạng thái chờ update
        const newItem = await this.dataSource
          .getRepository(entityName)
          .findOne({
            where: { applyStatus: 'pendingUpdate' },
            order: { createdAt: 'desc' },
          });
        const pendingId = newItem.id;
        if (params.status == 'approve') {
          delete newItem.id;
          delete newItem.createdAt;
          delete newItem.updatedAt;
          delete newItem.applyStatus;
          // update item cũ theo data mới
          await this.dataSource
            .getRepository(entityName)
            .update(checkRequest.idUpdate, newItem);
          // update item duplicate sang trạng thái expired
          await this.dataSource
            .getRepository(entityName)
            .update(pendingId, { applyStatus: 'expired' });
        } else if (params.status == 'reject') {
          // update item duplicate sang trạng thái reject
          await this.dataSource
            .getRepository(entityName)
            .update(newItem.id, { applyStatus: 'reject' });
        } else if (params.status == 'return') {
          await this.dataSource
            .getRepository(entityName)
            .update(params.idUpdate, { applyStatus: 'return' });
        }
      } else if (params.actionName == 'delete') {
        if (params.status == 'approve') {
          await this.dataSource
            .getRepository(entityName)
            .delete(params.idUpdate);
        } else if (params.status == 'reject') {
          await this.dataSource
            .getRepository(entityName)
            .update(params.idUpdate, { applyStatus: 'applied' });
        }
      } else if (params.actionName == 'insert') {
        if (params.status == 'approve') {
          await this.dataSource
            .getRepository(entityName)
            .update(params.idUpdate, { applyStatus: 'applied' });
        } else if (params.status == 'reject') {
          await this.dataSource
            .getRepository(entityName)
            .delete(params.idUpdate);
        } else if (params.status == 'return') {
          await this.dataSource
            .getRepository(entityName)
            .update(params.idUpdate, { applyStatus: 'return' });
        }
      }
      // update yêu cầu duyệt
      const result = await this.requestUpdateRepo.update(id, params);
      return result;
    } catch (e: any) {
      const stack = e.stack;
      e = { ...e, stack: stack };
      throw new Error(e.stack.split('\n')[0]);
    }
  }
}
