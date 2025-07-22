import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('QAINS_OPERATOR_AUDITOR')
export class QainsOperatorAuditor {
    @PrimaryColumn()
    CYEAR2:string;

    @PrimaryColumn()
    NRUNNO:string;

    @PrimaryColumn()
    QOA_SEQ:string;

    @Column()
    QOA_EMPNO:string;

    @Column()
    QOA_EMPNAME:string;

    @Column()
    QOA_TYPECODE:string;

    @Column()
    QOA_TYPENO:string;
}
