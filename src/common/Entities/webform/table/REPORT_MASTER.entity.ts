import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'REPORT_MASTER', schema: 'WEBFORM' })
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
}
