import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'WORK_PLAN', schema: 'DOCINV' })
export class WorkPlan {
    @PrimaryColumn()
    PLANID: number;

    @Column({ nullable: true })
    PLANYEAR: number;

    @Column({ nullable: true })
    REQ_DIV: string;

    @Column({ nullable: true })
    REQ_DEPT: string;

    @Column({ nullable: true })
    REQ_NO: string;

    @Column({ nullable: true })
    REQ_PIC: string;

    @Column({ nullable: true })
    OBJECTIVE: number;

    @Column({ nullable: true })
    CATEGORY: string;

    @Column({ nullable: true })
    TITLE: string;

    @Column({ nullable: true })
    PURPOSE: string;

    @Column({ nullable: true })
    PLANCONFIRM: string;

    @Column({ nullable: true })
    PROFIT: number;

    @Column({ nullable: true })
    DEV_NO: string;

    @Column({ nullable: true })
    PLANSTART: string;

    @Column({ nullable: true })
    PLANFINISH: string;

    @Column({ nullable: true })
    DEV_COST: number;

    @Column({ default: 0, nullable: true })
    DEV_INVESTMENT: number;

    @Column({ nullable: true })
    PRJSTS_ID: number;

    @Column({ nullable: true })
    STATUS_ID: number;

    @Column({ nullable: true })
    REASON: string;

    @Column({ nullable: true })
    SYSNAME: string;

    @Column({ nullable: true })
    REQ_ID: number;

    @Column({ nullable: true })
    OBJOTHER: string;

    @Column({ type: 'date', nullable: true })
    RELEASE_DATE: Date;

    @Column({ default: 0, nullable: true })
    DEV_TIME: number;

    @Column({ type: 'timestamp', nullable: true })
    LATEST_UPDATE: Date;

    @Column({ nullable: true })
    REF_ID: number;
}
