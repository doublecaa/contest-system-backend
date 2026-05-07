import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('nvarchar', { length: 500, nullable: true })
    name: string;

    @Column('text', { nullable: true })
    avatarUrl: string;

    @Column({ length: 50, nullable: true })
    phoneNumber: string;

    @Column('datetime2', { nullable: true })
    birthday: Date;

    @Column({ length: 50, nullable: true })
    email: string;

    @Column('nvarchar', { length: 500, nullable: true })
    address: string;

    @Column({ length: 500 })
    password: string;

    @Column({ length: 500, nullable: true })
    refreshToken: string;

    @Column({ length: 500, nullable: true })
    accessToken: string;

    /*
        0: Bị khoá
        1: Hoạt động
    */
    @Column({ default: 1 })
    status: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}