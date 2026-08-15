// NFRMNO	NUMBER
// VORGNO	VARCHAR2
// CYEAR	CHAR
// CYEAR2	CHAR
// NRUNNO	NUMBER
// EMPNO	VARCHAR2
// SENDDATE	DATE
// FRMLVDATE	DATE
// TOLVDATE	DATE
// FRMLVTIME	CHAR
// TOLVTIME	CHAR
// TYPENO	NUMBER
// REASON	VARCHAR2
// TOTLV	VARCHAR2
// NUSED	VARCHAR2
// NRIGHT	VARCHAR2
// VFILENAME	VARCHAR2
// REQTO	CHAR
// CAPPROVE	CHAR

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

@Entity({ name: 'LVAPP', schema: 'WEBFORM' })
export class LVAPP {
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
    SENDDATE: Date;

    @Column()
    FRMLVDATE: Date;

    @Column()
    TOLVDATE: Date;

    @Column()
    FRMLVTIME: string;

    @Column()
    TOLVTIME: string;

    @Column()
    TYPENO: number;

    @Column()
    REASON: string;

    @Column()
    TOTLV: string;

    @Column()
    NUSED: string;

    @Column()
    NRIGHT: string;

    @Column()
    VFILENAME: string;

    @Column()
    REQTO: string;

    @Column()
    CAPPROVE: string;

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
}
