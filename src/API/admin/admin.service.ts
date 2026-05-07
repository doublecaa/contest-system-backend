import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../../database/entities';
import { Like, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginAdminDto, AdminFilterDto, ChangePasswordDto, ResetPasswordDto, UpdateAdminDto, CreateAdminDto } from './dto';
import { Roles } from 'src/common/enums/roles.enum';
import CheckPermission from 'src/common/module/checkPermission';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
const generator = require('generate-password');

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    private jwtService: JwtService,
    private checkPermission: CheckPermission,
  ) { }
  async generateToken(admin: Admin) {
    const data = {
      id: admin.id,
      email: admin.email,
      role: Roles.Admin
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
  async login(params: LoginAdminDto) {
    try {
      // Kiểm tra email có tồn tại
      const admin = await this.adminRepo.findOne({
        where: { email: params.email }
      })
      if (!admin) {
        throw new UnauthorizedException(`${params.email} is not exist`);
      }
      // So khớp mật khẩu trong DB
      const matchPassword = compareSync(params.password, admin.password);
      if (!matchPassword) {
        throw new UnauthorizedException('Account or password is incorrect');
      }
      // Tạo token, update vào DB
      const { refreshToken, accessToken } = await this.generateToken(admin);
      await this.adminRepo.update(admin.id, {
        refreshToken,
        accessToken,
      });
      delete admin.password;
      delete admin.refreshToken;
      delete admin.accessToken;
      return {
        accessToken,
        refreshToken,
        data: admin,
      };
    } catch (e: any) {
      throw new Error(e.stack.split('\n')[0]);
    }
  }

  async changePassword(params: ChangePasswordDto, req: any) {
    try {
      // Từ access token lấy ra admin id
      const admin = await this.adminRepo.findOne({
        where: { id: req.user.id },
      });
      if (!admin) {
        throw new NotFoundException();
      }
      // So sánh mật khẩu trong DB
      const match = compareSync(params.password, admin.password);
      if (!match) {
        throw new BadRequestException('PASSWORD_INCORRECT');
      }
      // Mã hoá mật khẩu mới
      const saltRounds = 10;
      const salt = genSaltSync(saltRounds);
      const hash = hashSync(params.newPassword, salt);
      // Cập nhật mật khẩu mã hoá mới trong DB
      // Cập nhật refresh token = null và access token = null trong DB
      const result = await this.adminRepo.update(admin.id, {
        password: hash,
        refreshToken: null,
        accessToken: null,
      });
      return result;
    } catch (e: any) {
      const stack = e.stack;
      e = { ...e, stack: stack };
      if (e.message == 'PASSWORD_INCORRECT') {
        throw new BadRequestException('PASSWORD_INCORRECT');
      } else {
        throw new Error(e.stack.split('\n')[0]);
      }
    }
  }
  async resetPassword(params: ResetPasswordDto) {
    const admin = await this.adminRepo.findOne({
      where: { email: params.email },
    });
    if (!admin) {
      throw new NotFoundException('ADMIN_NOT_FOUND');
    }
    // Tạo mật khẩu ngẫu nhiên có ít nhất 6 ký tự, 1 ký tự đặc biệt, 1 chữ hoa, có số
    const password = generator.generate({
      length: 10,
      numbers: true,
      lowercase: true,
      uppercase: true,
      symbols: true,
      strict: true,
      exclude: '"{}|?.,/:;[]()`~<>=-_+',
    });
    // Mã hoá mật khẩu
    const saltRounds = 10;
    const salt = genSaltSync(saltRounds);
    const hash = hashSync(password, salt);
    await this.adminRepo.update(admin.id, { password: hash });
    // const a = await this.emailFunction.sendPasswordToStaff(
    //   params.email,
    //   'Reset mật khẩu nhân viên',
    //   admin.accountDomain,
    //   password,
    // );
    console.log(password);
    return {};
  }
  async logout(header: any) {
    try {
      const headerToken = header['authorization']?.replace(/^bearer\s/gi, '');
      const result = this.adminRepo.update(
        { accessToken: headerToken },
        {
          refreshToken: null,
          accessToken: null,
        },
      );
      return result;
    } catch (e: any) {
      const stack = e.stack;
      e = { ...e, stack: stack };
      throw new Error(e.stack.split('\n')[0]);
    }
  }

  async getList(params: AdminFilterDto, req: any) {
    try {
      // Kiểm tra quyền lấy danh sách admin
      await this.checkPermission.Check(req.user, 'getList');
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
      const data = await this.adminRepo.find({
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
      const total = await this.adminRepo.count({
        where: filter,
        order: order,
      });
      const result = {
        data: data,
        total: total,
      };
      // Trả kết quả
      return result;
    } catch (e: any) {
      throw new Error(e.stack.split('\n')[0]);
    }
  }

  async getDetails(id: number, req: any) {
    try {
      // Kiểm tra quyền xem chi tiết nhân viên
      await this.checkPermission.Check(req.user, 'getDetails');
      // Lấy chi tiết nhân viên trong DB
      const result = await this.adminRepo.findOne({
        where: {
          id: id,
        },
        select: {
          role: {
            id: true,
            name: true,
            permission: true,
          },
        },
        relations: {
          role: true,
        },
      });
      if (!result) {
        throw new NotFoundException(`id ${id} is not exist`);
      }
      delete result.accessToken;
      delete result.refreshToken;
      delete result.password;
      //Trả kết quả
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
  async updateById(id: number, params: UpdateAdminDto, req: any) {
    try {
      // Kiểm tra quyền chỉnh sửa thông tin nhân viên
      await this.checkPermission.Check(req.user, 'update');
      const idCheck = await this.adminRepo.findOne({
        where: { id: id },
      });
      if (!idCheck) {
        throw new NotFoundException(`id ${id} is not exist`);
      }
      //Chỉnh sửa nhân viên trong DB
      const result = await this.adminRepo.update(id, params);
      //Trả kết quả
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
  async create(params: CreateAdminDto, req: any) {
    try {
      // Kiểm tra quyền tạo nhân viên mới
      await this.checkPermission.Check(req.user, 'insert');
      const foundAdmin = await this.adminRepo.findOne({
        where: { email: params.email },
      });
      if (foundAdmin) {
        throw new ConflictException('EMAIL_ALREADY_EXIST');
      }
      // Tạo mật khẩu ngẫu nhiên có ít nhất 6 ký tự, 1 ký tự đặc biệt, 1 chữ hoa, có số
      const password = generator.generate({
        length: 10,
        numbers: true,
        lowercase: true,
        uppercase: true,
        symbols: true,
        strict: true,
        exclude: '"{}|?.,/:;[]()`~<>=-_+',
      });
      // Mã hoá mật khẩu
      const saltRounds = 10;
      const salt = genSaltSync(saltRounds);
      const hash = hashSync(password, salt);
      // Tạo admin mới trong DB
      const createAdmin = await this.adminRepo.insert({
        email: params.email,
        name: params.name,
        password: hash,
        roleId: params.roleId,
      });
      // Gửi email username và mật khẩu đến mail của admin
      // await this.emailFunction.sendInfoMail(
      //   params.email,
      //   `Mật khẩu tài khoản nhân viên RVI`,
      //   params.email.split('@')[0],
      //   password,
      // );
      // Trả kết quả
      return createAdmin.identifiers[0];
    } catch (e: any) {
      const stack = e.stack;
      e = { ...e, stack: stack };
      if (e.message == 'EMAIL_ALREADY_EXIST') {
        throw new ConflictException('EMAIL_ALREADY_EXIST');
      } else {
        throw new Error(e.stack.split('\n')[0]);
      }
    }
  }

  async delete(id: number, req: any) {
    try {
      await this.checkPermission.Check(req.user, 'delete');
      const idCheck = await this.adminRepo.findOne({ where: { id: id } });
      if (!idCheck) {
        throw new NotFoundException('CANT_FIND_ADMIN');
      }
      const result = await this.adminRepo.delete(id);
      return result;
    } catch (e: any) {
      const stack = e.stack;
      e = { ...e, stack: stack };
      if (e.message == 'CANT_FIND_ADMIN') {
        throw new NotFoundException('CANT_FIND_ADMIN');
      } else {
        throw new Error(e.stack.split('\n')[0]);
      }
    }
  }
}
