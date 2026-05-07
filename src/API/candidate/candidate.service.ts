import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Candidate } from '../../database/entities';
import CheckPermission from 'src/common/module/checkPermission';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepo: Repository<Candidate>,
    private checkPermission: CheckPermission,
  ) {}
  async getDetails(id: number, req: any) {
    try {
      if (req.user.role == 'admin') {
        // Kiểm tra quyền xem chi tiết thí sinh
        await this.checkPermission.Check(req.user, 'getDetails');
        // Lấy chi tiết thí sinh trong DB bằng id
        const result = await this.candidateRepo.findOne({
          where: { id: id },
          select: {
            user: {
              name: true,
              avatarUrl: true,
              createdAt: true,
            },
            competition: {
              id: true,
              title: true,
              status: true,
            },
          },
          relations: {
            user: true,
            competition: true,
          },
        });
        // Trả về kết quả
        return result;
      }
      // Lấy chi tiết thí sinh trong DB bằng id trong token
      const result = await this.candidateRepo.findOne({
        where: { userId: req.user.id },
      });
      // Trả về kết quả
      return result;
    } catch (e: any) {
      const stack = e.stack;
      e = { ...e, stack: stack };
      throw new Error(e.stack.split('\n')[0]);
    }
  }
}
