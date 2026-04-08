import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { QAINS_OPERATOR_AUDITOR } from './QAINS_OPERATOR_AUDITOR.entity';

@Entity({ name: 'QAINS_AUDIT', schema: 'WEBFORM' })
export class QAINS_AUDIT {
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
    QAA_TYPECODE: string;

    @PrimaryColumn()
    QAA_AUDIT_SEQ: number;

    @PrimaryColumn()
    QAA_TOPIC: number;

    @PrimaryColumn()
    QAA_SEQ: number;

    @Column()
    QAA_AUDIT: number;

    @Column()
    QAA_COMMENT: string;

    @ManyToOne(() => QAINS_OPERATOR_AUDITOR, (form) => form.QA_AUDIT)
    @JoinColumn([
        { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
        { name: 'VORGNO', referencedColumnName: 'VORGNO' },
        { name: 'CYEAR', referencedColumnName: 'CYEAR' },
        { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
        { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
        { name: 'QAA_TYPECODE', referencedColumnName: 'QOA_TYPECODE' },
        { name: 'QAA_AUDIT_SEQ', referencedColumnName: 'QOA_SEQ' },
    ])
    form: QAINS_OPERATOR_AUDITOR;
}
