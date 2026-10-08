import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'AMECORDERS_PROCESS',
    schema: 'ESCCHKSHT',
})
export class AMECORDERS_PROCESS {

    @PrimaryColumn()
    MFGNO: string;

    @PrimaryColumn()
    TAGNO: string;

    @PrimaryColumn()
    PROCSEQ: number;

    @Column()
    REFMFGNO: string;

    @Column()
    ITEM: string;

    @Column()
    PARTNAME: string;

    @Column()
    DWG: string;

    @Column()
    UPDWG: string;

    @Column()
    MAINDWG: string;

    @Column()
    QTY: number;

    @Column()
    CURRSTATE: number;

    @Column()
    PROCNO: string;

    @Column()
    PROCTP: number;

    @Column()
    PROCTC: number;

    @Column()
    PROCDATE: number;

    @Column()
    PROCTYPE: string;

    @Column()
    PROCSEC: string;

    @Column()
    PROCSHOP: string;

    @Column()
    PROCSTATUS: string;

    @Column()
    PREVPROC: string;

    @Column()
    PREVSEQ: number;

    @Column()
    PREVDATE: number;

    @Column()
    PREVTYPE: string;

    @Column()
    PREVSEC: string;

    @Column()
    PREVSHOP: string;

    @Column()
    PREVSTATUS: string;

    @Column()
    PRC: string;

    @Column()
    NEXTPROC: string;

    @Column()
    SDATE: Date;

    @Column()
    EDATE: Date;

    @Column()
    DOCNO: string;

    @Column()
    DOCSTATUS: string;

    @Column()
    NGFORM: string;

    @Column()
    NGREMARK: string;

    @Column()
    IS_COMMENT: string;

    @Column()
    LASTUPDATE: Date;
}