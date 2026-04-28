import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'GPRB_STAMP_REQ',
    schema: 'WEBFORM',
})
export class RB_STAMP_REQ {
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
    PURPOSE_ID: number;
    @Column()
    PURPOSE_OTHER: string;
    @Column()
    SPOSCODE: string;   
    @Column()
    NAME_STAMP: string;
    @Column()
    REMARK: string;
}
