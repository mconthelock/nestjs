import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'REPORT_MASTER', schema: 'WEBFORM', database: 'webform' })
export class ReportMaster {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    VORGNO: string;

    @Column()
    VNAME: string;

    @Column()
    VURL: string;

    @Column()
    CSTATUS: string;

    @Column()
    NSEQ: number;

    @Column()
    VDESC: string;
}
