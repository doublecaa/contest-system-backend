import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Competition, User } from './index';

@Entity()
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  userId: number;

  @Column({ default: 0 })
  competitionId: number;

  /*
    0: Chưa xác thực email tài khoản
    1: Chưa thi
    2: Đang thi
    3: Đã thi
  */
  @Column({ default: 1 })
  status: number;

  /*
    0: Cho phép thi
    1: Cấm thi
  */
  @Column({ default: 0 })
  banned: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Competition, (competition) => competition.candidates)
  competition: Competition;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
