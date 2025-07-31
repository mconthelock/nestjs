import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity('QAINS_FORMTS')
export class QainsFormts {
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
    QA_INCHARGE_SECTION: number;

    @Column()
    QA_INCHARGE_EMPNO: string;

    @Column()
    QA_TRAINING_DATE: Date;

    @Column()
    QA_OJT_DATE: Date;
}
