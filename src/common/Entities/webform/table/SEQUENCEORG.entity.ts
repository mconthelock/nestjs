import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { AMECUSERALL } from '../../amec/views/AMECUSERALL.entity';
@Entity({
    name: 'SEQUENCEORG',
    schema: 'WEBFORM',
    database: 'webform',
})
export class SEQUENCEORG {
    @PrimaryColumn()
    EMPNO: string;

    @PrimaryColumn()
    SPOSCODE: string;

    @PrimaryColumn()
    CCO: string;

    @PrimaryColumn()
    HEADNO: string;

    @PrimaryColumn()
    SPOSCODE1: string;

    @PrimaryColumn()
    CCO1: string;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    VORGNO1: string;

    @ManyToOne(() => AMECUSERALL)
    @JoinColumn({ name: 'EMPNO', referencedColumnName: 'SEMPNO' })
    EMPINFO: AMECUSERALL;
}
