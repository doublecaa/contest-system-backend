import {
  HttpException,
  HttpStatus,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionAction, PermissionModule } from '../../database/entities';
import { DataSource } from 'typeorm';

export class CheckPermission {
  constructor(
    private reflector: Reflector,
    @Inject(DataSource) private dataSource: DataSource,
  ) { }

  private async getModuleActionId(action: string) {
    // Lấy danh sách permission từ DB
    const actionList = await this.dataSource
      .getRepository(PermissionAction)
      .find();

    // Tìm id của action
    let idAction = undefined;
    const found = actionList.find((e) => e.code == action);
    if (found) {
      idAction = found.id;
    }
    return idAction
  }

  async Check(admin: any, action: string) {
    try {
      const idAction = await this.getModuleActionId(action)

      // Kiểm tra user có id permission không
      if (idAction) {
        const found = admin.permissionAction.find((e) => e == idAction);
        if (found) {
          return {
            id: admin.id,
            accept: true,
            error: null,
          };
        } else {
          throw new Error('NOT_FOUND_PERMISSION');
        }
      } else {
        throw new Error('NOT_FOUND_PERMISSION');
      }
    } catch (error: any) {
      if (error.message == 'NOT_FOUND_PERMISSION') {
        throw new HttpException(
          'Error:450-dont have permission',
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        throw new UnauthorizedException();
      }
    }
  }
  async CheckModuleAction(admin: any, module: string, action: string) {
    try {
      // Lấy moduleId 
      const findModule = await this.dataSource.getRepository(PermissionModule).findOne({
        where: { code: module }
      })
      const actions = admin.permissionMap[findModule.id]
      if (!actions) {
        throw new Error('NOT_FOUND_PERMISSION');
      }
      // Tìm id của action
      const idAction = await this.getModuleActionId(action)
      const hasAction = actions.includes(idAction);
      if(!hasAction){
        throw new Error('NOT_FOUND_PERMISSION');
      }
    } catch (error: any) {
      if (error.message == 'NOT_FOUND_PERMISSION') {
        throw new HttpException(
          'Error:450-dont have permission',
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        throw new UnauthorizedException();
      }
    }
  }
}

export default CheckPermission;
