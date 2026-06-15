import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { INV_HALFYEAR_REPORT_ASSIGN } from '../../skid/table/INV_HALFYEAR_REPORT_ASSIGN.entity';

@Entity({ name: 'PSCI_FORM', schema: 'WEBFORM' })
export class PSCI_FORM {
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
    ASSIGN_ID: number;

    @OneToOne(() => INV_HALFYEAR_REPORT_ASSIGN, (r) => r.PSCI_FORM)
    REPORT: INV_HALFYEAR_REPORT_ASSIGN;
}
