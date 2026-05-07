import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '../enums/roles.enum';
import { DataSource } from 'typeorm';
import { Admin, PermissionModule } from '../../database/entities';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(DataSource) private dataSource: DataSource,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Nếu @Public thì khỏi check AUTH
      const isPublic = this.reflector.get<boolean>(
        'isPublic',
        context.getHandler(),
      );
      if (isPublic) {
        return true;
      }
      // kiểm tra access token
      const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(
        'auth_role',
        [context.getHandler(), context.getClass()],
      );

      const req = context.switchToHttp().getRequest();
      const token = req.headers['authorization']?.replace(/^bearer\s/gi, '');

      if (!token) {
        throw new UnauthorizedException();
      }

      // Lấy user id từ access token
      const user = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });

      const isValidRole = requiredRoles.some((role) => role === user?.role);
      if (!isValidRole && requiredRoles?.length > 0) {
        throw new UnauthorizedException();
      }

      const controllerUrl = req.url.split('/')[1];
      const controller = controllerUrl.split('?')[0];

      if (user?.role == 'admin') {
        // kiểm tra quyền module
        const moduleList = await this.dataSource
          .getRepository(PermissionModule)
          .find();
        const adminInfo = await this.dataSource.getRepository(Admin).findOne({
          where: { id: user.id },
          relations: {
            role: true,
          },
        });
        if (adminInfo.accessToken !== token) {
          throw new Error('jwt expired');
        }
        let stringifyPermission = '';
        if (adminInfo.roleId && adminInfo.role) {
          stringifyPermission = adminInfo.role.permission;
        } else {
          throw new Error('permission');
        }
        stringifyPermission = stringifyPermission.replaceAll("'", '"');
        const permissionArr = JSON.parse(stringifyPermission);
        const permissionMap = {};
        for (const item of permissionArr) {
          const moduleId = Object.keys(item)[0];
          permissionMap[moduleId] = item[moduleId];
        }
        for (const module of moduleList) {
          const moduleId = module.id;

          if (!permissionMap[moduleId]) continue;

          if (
            controller === 'upload-image' ||
            controller === 'refresh-access-token'
          ) {
            delete user.iat;
            delete user.exp;
            req.user = { ...user, token, permissionMap };
            return true;
          }

          if (module.code === controller) {
            delete user.iat;
            delete user.exp;
            req.user = {
              ...user,
              permissionAction: permissionMap[moduleId],
              permissionMap
            };
            return true;
          }
        }
      } else {
        delete user.iat;
        delete user.exp;
        user.token = token;
        req.user = user;
        return true;
      }
      throw new Error('permission');
    } catch (error: any) {
      if (error.message == 'permission') {
        throw new HttpException(
          'Error:dont have permission module',
          HttpStatus.UNAUTHORIZED,
        );
      } else if (error.message == 'jwt expired') {
        throw new Error('ACCESS_TOKEN_EXPIRED');
      } else {
        throw new UnauthorizedException();
      }
    }
  }
}
