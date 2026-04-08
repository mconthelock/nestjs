import {
    Entity,
    PrimaryColumn,
    Column,
    OneToMany,
    JoinColumn,
    OneToOne,
} from 'typeorm';

import { AMECUSERALL } from '../../amec/views/AMECUSERALL.entity';
import { QAINS_OPERATOR_AUDITOR } from './QAINS_OPERATOR_AUDITOR.entity';
import { QA_FILE } from './QA_FILE.entity';
import { ITEM_STATION } from '../../escs/table/ITEM_STATION.entity';
import { USERS_SECTION } from '../../escs/table/USERS_SECTION.entity';
import { AUDIT_REPORT_REVISION } from '../../escs/table/AUDIT_REPORT_REVISION.entity';
import { AUDIT_REPORT_MASTER_ALL } from '../../escs/views/AUDIT_REPORT_MASTER_ALL.entity';
import { FORM } from './FORM.entity';

@Entity({ name: 'QAINS_FORM', schema: 'WEBFORM' })
export class QAINS_FORM {
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
    QA_ITEM: string;

    @Column()
    QA_REV: number;

    @Column()
    QA_INCHARGE_SECTION: number;

    @Column()
    QA_INCHARGE_EMPNO: string;

    @Column()
    QA_TRAINING_DATE: Date;

    @Column()
    QA_OJT_DATE: Date;

    @OneToOne(() => AMECUSERALL, (u) => u.QAINCHARGE)
    @JoinColumn({ name: 'QA_INCHARGE_EMPNO', referencedColumnName: 'SEMPNO' })
    QA_INCHARGE_INFO: AMECUSERALL | null;

    @OneToMany(() => QAINS_OPERATOR_AUDITOR, (qainsOA) => qainsOA.QAINSFORM)
    QA_AUD_OPT: QAINS_OPERATOR_AUDITOR[];

    @OneToMany(() => QA_FILE, (qaFile) => qaFile.QAINSFORM)
    QA_FILES: QA_FILE[];

    @OneToOne(() => USERS_SECTION, (u) => u.QAINS)
    @JoinColumn({ name: 'QA_INCHARGE_SECTION', referencedColumnName: 'SEC_ID' })
    QA_INCHARGE_SECTION_INFO: USERS_SECTION | null;

    @OneToOne(() => AUDIT_REPORT_REVISION, (q) => q.QAINSREV)
    @JoinColumn({ name: 'QA_REV', referencedColumnName: 'ARR_REV' })
    @JoinColumn({
        name: 'QA_INCHARGE_SECTION',
        referencedColumnName: 'ARR_SECID',
    })
    QA_REV_INFO: AUDIT_REPORT_REVISION | null;

    @OneToMany(() => AUDIT_REPORT_MASTER_ALL, (a) => a.QAINS_FORM)
    QA_MASTER: AUDIT_REPORT_MASTER_ALL[] | null;

    @OneToMany(() => ITEM_STATION, (i) => i.QAINSFORM)
    ITEM_STATION: ITEM_STATION[] | null;

    @OneToOne(() => FORM, (form) => form.QA_INSFORM)
    @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
    @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
    @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
    FORM: FORM | null;
}
