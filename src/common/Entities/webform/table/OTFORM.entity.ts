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
import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'OTFORM', schema: 'WEBFORM' })
export class OTFORM {
    @PrimaryColumn()
    NFRMNO: number;

    @Column()
    VORGNO: string;

    @Column()
    CYEAR: string;

    @Column()
    CYEAR2: string;

    @Column()
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
}
