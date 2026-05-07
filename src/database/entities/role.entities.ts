import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Admin } from './admin.entities';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('nvarchar', { length: 500 })
  name: string;

  @Column('text', { default: '' })
  permission: string;

  @Column('nvarchar', { length: 'MAX', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Admin, (admin) => admin.role)
  public admins: Admin[];
}
