import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'REPORT_MASTER_AUTH', schema: 'WEBFORM' })
export class ReportMasterAuth {
    @PrimaryColumn()
    VEMPNO: string;

    @PrimaryColumn()
    REPORT: number;

    @Column()
    CAUTHNO: string;
}
