import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { QAINS_FORM } from './QAINS_FORM.entity';
import { QAINS_OPERATOR_AUDITOR } from './QAINS_OPERATOR_AUDITOR.entity';
import { QA_TYPE } from './QA_TYPE.entity';

@Entity({ name: 'QA_FILE', schema: 'WEBFORM' })
export class QA_FILE {
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
    FILE_TYPECODE: string;

    @PrimaryColumn()
    FILE_ID: number;

    @Column()
    FILE_ONAME: string;

    @Column()
    FILE_FNAME: string;

    @Column()
    FILE_USERCREATE: string;

    @Column()
    FILE_DATECREATE: Date;

    @Column()
    FILE_USERUPDATE: string;

    @Column()
    FILE_DATEUPDATE: Date;

    @Column()
    FILE_STATUS: number;

    @Column()
    FILE_PATH: string;

    @Column()
    FILE_EXTRA_KEY1: number;

    @Column()
    FILE_EXTRA_KEY2: string;

    @ManyToOne(() => QAINS_FORM, (form) => form.QA_FILES)
    @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
    @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
    @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
    QAINSFORM: QAINS_FORM | null;

    @ManyToOne(() => QA_TYPE, (t) => t.FILE_TYPE)
    @JoinColumn({ name: 'FILE_TYPECODE', referencedColumnName: 'QAT_CODE' })
    TYPE: QA_TYPE | null;

    @ManyToOne(() => QAINS_OPERATOR_AUDITOR, (oa) => oa.QA_FILES)
    @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
    @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
    @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
    @JoinColumn({ name: 'FILE_EXTRA_KEY1', referencedColumnName: 'QOA_SEQ' })
    @JoinColumn({
        name: 'FILE_EXTRA_KEY2',
        referencedColumnName: 'QOA_TYPECODE',
    })
    QAINSOA: QAINS_OPERATOR_AUDITOR | null;
}
