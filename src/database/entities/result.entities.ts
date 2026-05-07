import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Candidate } from './index';

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  candidateId: number;

  @Column({ default: 0 })
  rankLyThuyet: number;

  @Column({ default: 0 })
  hieuSuatDauTu: number;

  @Column({ default: 0 })
  ketQuaChungCuoc: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Candidate)
  @JoinColumn()
  candidate: Candidate;
}
