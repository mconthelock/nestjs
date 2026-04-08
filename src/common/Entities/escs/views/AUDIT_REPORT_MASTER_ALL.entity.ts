import { JoinColumn, ManyToOne, ViewColumn, ViewEntity } from 'typeorm';
import { QAINS_FORM } from '../../webform/table/QAINS_FORM.entity';

@ViewEntity({ name: 'AUDIT_REPORT_MASTER_ALL', schema: 'ESCCHKSHT' })
export class AUDIT_REPORT_MASTER_ALL {
    @ViewColumn()
    ARM_SECID: number;

    @ViewColumn()
    ARM_REV: number;

    @ViewColumn()
    ARM_NO: number;

    @ViewColumn()
    ARM_SEQ: number;

    @ViewColumn()
    ARM_DETAIL: string;

    @ViewColumn()
    ARM_TYPE: string;

    @ViewColumn()
    ARM_STATUS: number;

    @ViewColumn()
    ARM_FACTOR?: number;

    @ViewColumn()
    ARM_MAXSCORE?: number;

    @ManyToOne(() => QAINS_FORM, (q) => q.QA_MASTER)
    @JoinColumn({
        name: 'ARM_SECID',
        referencedColumnName: 'QA_INCHARGE_SECTION',
    })
    @JoinColumn({ name: 'ARM_REV', referencedColumnName: 'QA_REV' })
    QAINS_FORM: QAINS_FORM | null;
}
