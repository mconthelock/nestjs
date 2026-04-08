import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToOne,
    OneToMany,
} from 'typeorm';

import { QAINS_FORM } from './QAINS_FORM.entity';
import { AMECUSERALL } from '../../amec/views/AMECUSERALL.entity';
import { QA_FILE } from './QA_FILE.entity';
import { QAINS_AUDIT } from './QAINS_AUDIT.entity';
import { QA_TYPE } from './QA_TYPE.entity';

@Entity({ name: 'QAINS_OPERATOR_AUDITOR', schema: 'WEBFORM' })
export class QAINS_OPERATOR_AUDITOR {
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
    QOA_SEQ: number;

    @PrimaryColumn()
    QOA_TYPECODE: string;

    @Column()
    QOA_EMPNO: string;

    @Column()
    QOA_AUDIT: number;

    @Column()
    QOA_RESULT: number;

    @Column('decimal', {
        // สำหรับ Oracle
        precision: 5, // เช่น 999.99 = 5 หลัก
        scale: 2, // เก็บทศนิยม 2 ตำแหน่ง
    })
    QOA_PERCENT: number;

    @Column()
    QOA_SCORE: number;

    @Column()
    QOA_GRADE: string;

    @Column()
    QOA_AUDIT_RESULT: string;

    @Column()
    QOA_IMPROVMENT_ACTIVITY: string;

    @Column()
    QOA_STATION: string;

    @ManyToOne(() => QAINS_FORM, (form) => form.QA_AUD_OPT)
    @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
    @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
    @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
    QAINSFORM: QAINS_FORM | null;

    @ManyToOne(() => QA_TYPE, (t) => t.QOA_TYPE)
    @JoinColumn({ name: 'QOA_TYPECODE', referencedColumnName: 'QAT_CODE' })
    TYPE: QA_TYPE | null;

    @OneToOne(() => AMECUSERALL, (user) => user.QAINSOA)
    @JoinColumn({ name: 'QOA_EMPNO', referencedColumnName: 'SEMPNO' })
    QOA_EMPNO_INFO: AMECUSERALL | null;

    @OneToMany(() => QAINS_AUDIT, (audit) => audit.form)
    QA_AUDIT: QAINS_AUDIT[];

    @OneToMany(() => QA_FILE, (file) => file.QAINSOA)
    QA_FILES: QA_FILE[];
}
