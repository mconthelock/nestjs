import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { INV_HALFYEAR_REPORT } from '../../skid/table/INV_HALFYEAR_REPORT.entity';
import { INV_HALFYEAR_RESULT } from '../../skid/table/INV_HALFYEAR_RESULT.entity';

@Entity({ name: 'PSCIH_FORM', schema: 'WEBFORM' })
export class PSCIH_FORM {
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

    @Column()
    REPORT_ID: number;

    @OneToOne(() => INV_HALFYEAR_REPORT, (r) => r.PSCIH_FORM)
    REPORT: INV_HALFYEAR_REPORT;

    @OneToMany(() => INV_HALFYEAR_RESULT, (r) => r.FORM)
    RESULT: INV_HALFYEAR_RESULT[];
}
