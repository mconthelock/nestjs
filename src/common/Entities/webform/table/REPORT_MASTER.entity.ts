import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'REPORT_MASTER', schema: 'WEBFORM' })
export class ReportMaster {
    @PrimaryColumn()
    ID: number;

    @Column()
    VORGNO: string;

    @Column()
    VNAME: string;

    @Column()
    VURL: string;

    @Column()
    CSTAUS: string;
}
