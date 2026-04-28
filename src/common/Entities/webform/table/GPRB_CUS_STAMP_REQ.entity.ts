import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'GPRB_CUS_STAMP_REQ',
    schema: 'WEBFORM',
})
export class RB_CUS_STAMP_REQ {
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
    CUST_SIZE: string;
    @Column()
    QTY: number;
    @Column()
    REMARK: string;
}
