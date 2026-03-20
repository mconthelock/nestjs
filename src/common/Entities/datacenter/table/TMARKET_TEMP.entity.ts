import { Tmaintaintype } from 'src/marketing/tmaintaintype/entities/tmaintaintype.entity';
import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'TMARKET_TEMP', schema: 'AMECMFG' })
export class TMARKET_TEMP {
    @Column()
    SERIES: string;

    @Column()
    AGENT: string;

    @Column()
    PRJ_NO: string;

    @Column()
    PRJ_NAME: string;

    @Column()
    DSTN: string;

    @Column()
    ORDER_NO: string;

    @Column()
    SPEC: string;

    @Column()
    OPERATION: string;

    @PrimaryColumn()
    MFGNO: string;

    @Column()
    CAR_NO: string;

    @Column()
    IDS_DATE: string;

    @Column()
    CUST_RQS: string;

    @PrimaryColumn()
    EDIT_DATE: Date;

    @PrimaryColumn()
    REVISION_CODE: string;

    @PrimaryColumn()
    REVISION_EDIT: string;

    @Column()
    AMEC_SCHDL: Date;
}
