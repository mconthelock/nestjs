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
import { LeaveType } from '../../gpreport/table/LEAVE_TYPE.entity';
import { LR100P } from '../../gpreport/views/LR100P.entity';
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

    @Column({
        transformer: {
            to: (value: number | string | null | undefined) => {
                if (value === null || value === undefined) return value;
                return String(value).padStart(2, '0');
            },
            from: (value: number | string | null | undefined) => {
                if (value === null || value === undefined) return value;
                return String(value).padStart(2, '0');
            },
        },
    })
    TYPENO: string;

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

    @ManyToOne(() => LeaveType, (leaveType) => leaveType.LV_CODE)
    @JoinColumn({
        name: 'TYPENO',
        referencedColumnName: 'LV_CODE',
    })
    types: LeaveType;

    @OneToOne(() => LR100P, (lr100p) => lr100p)
    @JoinColumn({ name: 'EMPNO', referencedColumnName: 'LR103' })
    @JoinColumn({ name: 'TYPENO', referencedColumnName: 'LR109' })
    @JoinColumn({ name: 'FRMLVTIME', referencedColumnName: 'LR110' })
    actual: LR100P;
}
