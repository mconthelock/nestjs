import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { INV_HALFYEAR_RESULT } from './INV_HALFYEAR_RESULT.entity';
import { INV_YEARLY_RESULT } from './INV_YEARLY_RESULT.entity';

@Entity({ name: 'MV_IMM_ITEMMST', schema: 'SKIDCNTRL' })
export class MV_IMM_ITEMMST {
    @Column()
    IID: string;

    @PrimaryColumn()
    IPROD: string;

    @Column()
    IDESC: string;

    @Column()
    IDRAW: string;

    @Column()
    IGLNO: string;

    @Column()
    IITYP: string;

    @Column()
    ILEAD: number;

    @Column()
    IUMS: string;

    @Column()
    IUMP: string;

    @Column()
    IUMCN: number;

    @Column()
    IONOD: number;

    @Column()
    ONHAND: number;

    @Column()
    IABBT: string;

    @Column()
    IPURC: string;

    @Column()
    IBUYC: string;

    @Column()
    BUYER: string;

    @Column()
    BUYERNAME: string;

    @Column()
    BUYERTNAME: string;

    @Column()
    CODE: string;

    @Column()
    ZONE: string;

    @Column()
    USER_ID: string;

    @Column()
    FOREMAN_ID: string;

    @Column()
    ITEM_ADDR: string;

    @Column()
    UPDATE_AT: Date;

    @Column()
    UPDATE_BY: string;

    @Column()
    SPECIAL: string;

    @Column()
    USER_NAME: string;

    @Column()
    USER_TNAME: string;

    @Column()
    USER_SECCODE: string;

    @Column()
    USER_SECNAME: string;

    @Column()
    FOREMAN_NAME: string;

    @Column()
    FOREMAN_TNAME: string;

    @OneToOne(() => INV_HALFYEAR_RESULT, (r) => r.ITEM_DETAIL)
    RESULT: INV_HALFYEAR_RESULT;

    @OneToOne(() => INV_YEARLY_RESULT, (r) => r.ITEM)
    YEARLY_RESULT: INV_YEARLY_RESULT;
}
// Column Name	#	Type	Type Mod	Not Null	Default	Comment
// IID	1	VARCHAR2(2)	[NULL]	true	[NULL]
// IPROD	2	VARCHAR2(15)	[NULL]	true	[NULL]
// IDESC	3	VARCHAR2(30)	[NULL]	false	[NULL]
// IDRAW	4	VARCHAR2(15)	[NULL]	false	[NULL]
// IGLNO	5	VARCHAR2(24)	[NULL]	false	[NULL]
// IITYP	6	VARCHAR2(1)	[NULL]	false	[NULL]
// ILEAD	7	NUMBER(3,0)	[NULL]	false	[NULL]
// IUMS	8	VARCHAR2(2)	[NULL]	false	[NULL]
// IUMP	9	VARCHAR2(2)	[NULL]	false	[NULL]
// IUMCN	10	NUMBER(9,3)	[NULL]	false	[NULL]
// IPFDV	11	VARCHAR2(4)	[NULL]	false	[NULL]
// ISCST	12	NUMBER(11,4)	[NULL]	false	[NULL]
// IONOD	13	NUMBER	[NULL]	false	[NULL]
// ONHAND	14	NUMBER	[NULL]	false	[NULL]
// IABBT	15	VARCHAR2(7)	[NULL]	false	[NULL]
// IPURC	16	VARCHAR2(1)	[NULL]	false	[NULL]
// IBUYC	17	VARCHAR2(1)	[NULL]	false	[NULL]
// BUYER	18	VARCHAR2(5)	[NULL]	false	[NULL]
// BUYERNAME	19	VARCHAR2(360)	[NULL]	false	[NULL]
// BUYERTNAME	20	VARCHAR2(360)	[NULL]	false	[NULL]
// CODE	21	VARCHAR2(22)	[NULL]	false	[NULL]
// ZONE	22	VARCHAR2(50)	[NULL]	false	[NULL]
// GROUP_ZONE	23	VARCHAR2(100)	[NULL]	false	[NULL]
// USER_ID	24	VARCHAR2(20)	[NULL]	false	[NULL]
// FOREMAN_ID	25	VARCHAR2(20)	[NULL]	false	[NULL]
// ITEM_ADDR	26	VARCHAR2(255)	[NULL]	false	[NULL]
// UPDATE_AT	27	DATE	[NULL]	false	[NULL]
// UPDATE_BY	28	VARCHAR2(100)	[NULL]	false	[NULL]
// SPECIAL	29	VARCHAR2(3)	[NULL]	false	[NULL]
// USER_NAME	30	VARCHAR2(360)	[NULL]	false	[NULL]
// USER_TNAME	31	VARCHAR2(360)	[NULL]	false	[NULL]
// USER_SECCODE	32	VARCHAR2(18)	[NULL]	false	[NULL]
// USER_SECNAME	33	VARCHAR2(180)	[NULL]	false	[NULL]
// FOREMAN_NAME	34	VARCHAR2(360)	[NULL]	false	[NULL]
// FOREMAN_TNAME	35	VARCHAR2(360)	[NULL]	false	[NULL]
