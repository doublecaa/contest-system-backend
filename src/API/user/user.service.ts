import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'src/common/enums/roles.enum';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { UpdateUserDto } from './dto';
import CheckPermission from 'src/common/module/checkPermission';
import { UploadImageService } from '../upload-image/upload-image.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private checkPermission: CheckPermission,
    private uploadService: UploadImageService,
  ) { }
  private async generateToken(admin: User) {
    const data = {
      id: admin.id,
      email: admin.email,
      role: Roles.User
    };
    const accessToken = await this.jwtService.signAsync(data, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    });
    const refreshToken = await this.jwtService.signAsync(data, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
    });
    return { accessToken, refreshToken };
  }

  async login(params: LoginUserDto) {
    try {
      // Kiểm tra email có tồn tại
      const user = await this.userRepo.findOne({
        where: {
          email: params.email
        }
      })
      if (!user) {
        throw new UnauthorizedException(`${params.email} is not exist`);
      }
      // Tạo token, update vào DB
      const { refreshToken, accessToken } = await this.generateToken(user)
      await this.userRepo.update(user.id, {
        refreshToken,
        accessToken
      })
      // xoá bớt field
      delete user.password
      delete user.accessToken
      delete user.refreshToken

      return {
        accessToken,
        refreshToken,
        data: user
      }
    } catch (error: any) {
      throw new Error(error.stack.split('\n')[0]);

    }
  }

  async register(params: CreateUserDto) {
    // Kiểm tra email đã tồn tại
    const user = await this.userRepo.findOne({
      where: {
        email: params.email
      }
    })
    if (user) {
      throw new UnauthorizedException(`${params.email} already exist`);
    }
    const saltRounds = 10
    const salt = genSaltSync(saltRounds)
    const hash = hashSync(params.password, salt)
    const createUser = await this.userRepo.insert({
      email: params.email,
      name: params.name,
      password: hash
    })
    return {
      id: createUser.identifiers[0].id
    }
  }

  async updateUser(id: number, params: UpdateUserDto, req: any) {
    try {
      const user = await this.userRepo.findOne({ where: { id: req.user.id } })
      if (params.avatarUrl !== user.avatarUrl) {
        //update image link
        const fileFormat = params.avatarUrl.split('.').reverse()[0];
        const oldFileName = params.avatarUrl.split('/').reverse()[0];
        const newFileName = `${user.id}.${fileFormat}`;
        const folderPath = `media/users/`;
        const newImageLink = await this.uploadService.updateImageLink(
          folderPath,
          oldFileName,
          newFileName,
        );
        params.avatarUrl = newImageLink.toString();
      }
      // Cập nhật dữ liệu mới vào DB
      const result = await this.userRepo.update(req.user.id, params);
      return result;
    } catch (error: any) {

    }
  }

  async getDetails(id: number, req: any) {
    try {
      if (req.user.role == 'admin') {
        await this.checkPermission.Check(req.user, 'getDetails');
        const result = await this.userRepo.findOne({ where: { id: id } });
        return result;
      }
      // Lấy dữ liệu user trong db bằng user id
      const result = await this.userRepo.findOne({
        where: {
          id: req.user.id,
        },
      });
      // Trả kết quả
      return result;
    } catch (e: any) {
      const stack = e.stack;
      e = { ...e, stack: stack };
      throw new Error(e.stack.split('\n')[0]);
    }
  }
}
