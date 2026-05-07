import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PermissionModule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  code: string;

  @Column('nvarchar', { length: 'MAX', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
