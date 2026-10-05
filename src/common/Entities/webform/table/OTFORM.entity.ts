// NFRMNO	NUMBER
// VORGNO	VARCHAR2
// CYEAR	CHAR
// CYEAR2	CHAR
// NRUNNO	NUMBER
// EMPNO	VARCHAR2
// WORKDATE	DATE
// TIMEIN	CHAR
// TIMEOUT	CHAR
// OTJOB	VARCHAR2
// WKTYPENO	NUMBER
// REMARK	VARCHAR2
// FORSECCODE	VARCHAR2
// VFILENAME	VARCHAR2
// OT3	VARCHAR2
// SPECIAL	CHAR
// SPECIAL_REASON	VARCHAR2

import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { FORM } from './FORM.entity';
import { User } from '../../webform/views/AMECUSERALL.entity';
import { LR200P } from '../../gpreport/views/LR200P.entity';

@Entity({ name: 'OTFORM', schema: 'WEBFORM' })
export class OTFORM {
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
    EMPNO: string;

    @Column()
    WORKDATE: Date;

    @Column()
    TIMEIN: string;

    @Column()
    TIMEOUT: string;

    @Column()
    OTJOB: string;

    @Column()
    WKTYPENO: number;

    @Column()
    REMARK: string;

    @Column()
    FORSECCODE: string;

    @Column()
    VFILENAME: string;

    @Column()
    OT3: string;

    @Column()
    SPECIAL: string;

    @Column()
    SPECIAL_REASON: string;

    @OneToOne(() => FORM)
    @JoinColumn([
        { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
        { name: 'VORGNO', referencedColumnName: 'VORGNO' },
        { name: 'CYEAR', referencedColumnName: 'CYEAR' },
        { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
        { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
    ])
    form: FORM;

    @ManyToOne(() => User, (user) => user.SEMPNO)
    @JoinColumn({ name: 'EMPNO', referencedColumnName: 'SEMPNO' })
    user: User;

    @OneToOne(() => LR200P)
    @JoinColumn([
        { name: 'EMPNO', referencedColumnName: 'LR203' },
        { name: 'WORKDATE_STR', referencedColumnName: 'LR209' },
    ])
    actual: LR200P;
}
