import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'AMECORDERS_PROCESS',
    schema: 'ESCCHKSHT',
})
export class AMECORDERS_PROCESS {
    @ViewColumn()
    MFGNO: string;

    @ViewColumn()
    TAGNO: string;

    @ViewColumn()
    PROCSEQ: number;

    @ViewColumn()
    REFMFGNO: string;

    @ViewColumn()
    ITEM: string;

    @ViewColumn()
    PARTNAME: string;

    @ViewColumn()
    DWG: string;

    @ViewColumn()
    UPDWG: string;

    @ViewColumn()
    MAINDWG: string;

    @ViewColumn()
    QTY: number;

    @ViewColumn()
    CURRSTATE: number;

    @ViewColumn()
    PROCNO: string;

    @ViewColumn()
    PROCTP: number;

    @ViewColumn()
    PROCTC: number;

    @ViewColumn()
    PROCDATE: number;

    @ViewColumn()
    PROCTYPE: string;

    @ViewColumn()
    PROCSEC: string;

    @ViewColumn()
    PROCSHOP: string;

    @ViewColumn()
    PROCSTATUS: string;

    @ViewColumn()
    PREVPROC: string;

    @ViewColumn()
    PREVSEQ: number;

    @ViewColumn()
    PREVDATE: number;

    @ViewColumn()
    PREVTYPE: string;

    @ViewColumn()
    PREVSEC: string;

    @ViewColumn()
    PREVSHOP: string;

    @ViewColumn()
    PREVSTATUS: string;

    @ViewColumn()
    PRC: string;

    @ViewColumn()
    NEXTPROC: string;

    @ViewColumn()
    SDATE: Date;

    @ViewColumn()
    EDATE: Date;

    @ViewColumn()
    DOCNO: string;

    @ViewColumn()
    DOCSTATUS: string;

    @ViewColumn()
    NGFORM: string;

    @ViewColumn()
    NGREMARK: string;

    @ViewColumn()
    IS_COMMENT: string;

    @ViewColumn()
    LASTUPDATE: Date;
}