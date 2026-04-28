import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'OTFORM' })
export class Overtime {
    @PrimaryColumn()
    NFRMNO: number;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    CYEAR: string;

    @PrimaryColumn()
    CYEAR2: string;

    @PrimaryColumn()
    NRUNNO: number;

    @PrimaryColumn()
    EMPNO: string;

    @Column()
    WORKDATE: Date;

    @Column()
    TIMEIN?: string;

    @Column()
    TIMEOUT?: string;

    @Column()
    OTJOB?: string;

    @Column()
    REMARK?: string;

    @Column()
    FORSECCODE?: string;

    @Column()
    VFILENAME?: string;

    @Column()
    OT3?: string;

    @Column()
    SPECIAL?: string;

    @Column()
    SPECIAL_REASON?: string;
}
