import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Competition } from './index';

@Entity()
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  competitionId: number;

  @Column('text', { nullable: true })
  gioiThieuHeaderUrl: string;

  @Column('text', { nullable: true })
  mobileGioiThieuHeaderUrl: string;

  @Column('text', { nullable: true })
  redirectGioiThieuHeaderUrl: string;

  @Column('text', { nullable: true })
  contentGioiThieuHeader: string;

  @Column('text', { nullable: true })
  gioiThieuFooterUrl: string;

  @Column('text', { nullable: true })
  mobileGioiThieuFooterUrl: string;

  @Column('text', { nullable: true })
  redirectGioiThieuFooterUrl: string;

  @Column('text', { nullable: true })
  contentGioiThieuFooter: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Competition)
  @JoinColumn()
  competition: Competition;
}
