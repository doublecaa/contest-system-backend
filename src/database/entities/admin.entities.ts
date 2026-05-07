import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RequestUpdate, Role } from './index'

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    roleId: number;

    @Column('nvarchar', { length: 500, nullable: true })
    name: string;

    @Column({ length: 50, nullable: true, unique: true })
    email: string;

    @Column({ length: 500 })
    password: string;

    @Column({ length: 500, nullable: true })
    refreshToken: string;

    @Column({ length: 500, nullable: true })
    accessToken: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;


    @ManyToOne(() => Role, (role) => role.admins)
    public role: Role;


    @OneToMany(() => RequestUpdate, (requestUpdate) => requestUpdate.admin)
    requestUpdate: RequestUpdate;
}