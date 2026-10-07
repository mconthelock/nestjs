import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ReportMaster } from './REPORT_MASTER.entity';

@Entity({ name: 'REPORT_MASTER_AUTH', schema: 'WEBFORM' })
export class ReportMasterAuth {
    @PrimaryColumn()
    VEMPNO: string;

    @PrimaryColumn()
    REPORT: number;

    @Column()
    CAUTHNO: string;

    @ManyToOne(() => ReportMaster, (reportMaster) => reportMaster.ID)
    @JoinColumn({ name: 'REPORT', referencedColumnName: 'ID' })
    REPORT_MASTER: ReportMaster;
}
