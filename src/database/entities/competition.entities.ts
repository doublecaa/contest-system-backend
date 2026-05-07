import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
} from 'typeorm';
import {
    Candidate
} from './index';

@Entity()
export class Competition {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column('nvarchar', { length: 500 })
    title: string;

    @Column('nvarchar', { length: 'MAX', nullable: true })
    content: string;

    @Column('datetime2', { default: () => 'CURRENT_TIMESTAMP' })
    startDateApply: Date;

    @Column('datetime2', { default: () => 'CURRENT_TIMESTAMP' })
    endDateApply: Date;

    @Column('datetime2', { default: () => 'CURRENT_TIMESTAMP' })
    startDateCompetition: Date;

    @Column('datetime2', { default: () => 'CURRENT_TIMESTAMP' })
    endDateCompetition: Date;

    @Column({ default: 0 })
    maxNumberApply: number;

    @Column({ default: 0 })
    currentNumberApply: number;

    /*
    1: Mới
    2: Đang tuyển sinh
    3: Đang thi
    4: Đã thi
    */
    @Column({ default: 1 })
    status: number;

    /* 
    1: Dừng cuộc thi
    2: Tiếp tục cuộc thi
    */
    @Column({ default: 0 })
    pending: number;

    /*
      applied
      pending
    */
    @Column({ default: 'applied' })
    applyStatus: string;

    @Column('text', { default: '' })
    websiteUrl: string;

    // @Column('text', { default: '' })
    // rules: string;

    // @Column('text', { default: '' })
    // polls: string;

    // @Column('text', { default: '' })
    // prizes: string;

    // @Column('text', { default: '' })
    // questions: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Candidate, (candidate) => candidate.competition)
    candidates: Candidate;
}
