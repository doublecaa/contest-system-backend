import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Admin } from './index';

@Entity()
export class RequestUpdate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  adminId: number;

  @Column('nvarchar', { nullable: true, length: 'MAX' })
  content: string;

  @Column('nvarchar', { nullable: true, length: 'MAX' })
  feedback: string;

  @Column({ nullable: true })
  moduleName: string;

  @Column({ nullable: true })
  actionName: string;

  @Column({ default: 0 })
  idUpdate: number;

  /* 
    Wait
    Approve
    Reject
    Return  
  */
  @Column({ default: 'wait' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Admin, (admin) => admin.requestUpdate)
  admin: Admin;
}
