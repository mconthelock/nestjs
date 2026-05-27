import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'FINDS_STAMP_REPORT', schema: 'WEBFORM' })
export class DS_STAMP_REPORT {

    @PrimaryColumn()
    FYEAR: number;

    @Column()
    DATE_RECEIVE: Date;

    @Column()
    NFRMNO: number;

    @Column()
    VORGNO: number;

    @PrimaryColumn()
    CYEAR: string;

    @PrimaryColumn()
    CYEAR2: string;

    @PrimaryColumn()
    NRUNNO: number;
    
    @PrimaryColumn()
    REASON: string;

    @PrimaryColumn()
    VREQNO: string;

    @PrimaryColumn()
    REQUESTER: string;

    // ----------------------
    @PrimaryColumn()
    BUY_1_QTY: number;
    @PrimaryColumn()
    BUY_1_AMT: number;

    @PrimaryColumn()
    BUY_5_QTY: number;
    @PrimaryColumn()
    BUY_5_AMT: number;

    @PrimaryColumn()
    BUY_10_QTY: number;
    @PrimaryColumn()
    BUY_10_AMT: number;

    @PrimaryColumn()
    BUY_20_QTY: number;
    @PrimaryColumn()
    BUY_20_AMT: number;

    // ------------------------------------

    @PrimaryColumn()
    WD_1_QTY: number;
    @PrimaryColumn()
    WD_1_AMT: number;

    @PrimaryColumn()
    WD_5_QTY: number;
    @PrimaryColumn()
    WD_5_AMT: number;

    @PrimaryColumn()
    WD_10_QTY: number;
    @PrimaryColumn()
    WD_10_AMT: number;

    @PrimaryColumn()
    WD_20_QTY: number;
    @PrimaryColumn()
    WD_20_AMT: number;


     // ---------------------------------------
    // @Column()
    // OPTION_CODE: string;

    // @Column()
    // EFFECTIVE_DATE: Date;



    // @Column()
    // LOCATION: string;
}
