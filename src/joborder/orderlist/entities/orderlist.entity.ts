import { View, ViewColumn, ViewEntity } from 'typeorm';

// @ViewEntity({ name: 'AMECMFG.JOB_ORDER' })
@ViewEntity({ name: 'MV_JOB_ORDER', schema: 'AMECMFG' })
export class VOrderList {
    @ViewColumn()
    ORDTYPE: string | null;

    @ViewColumn()
    URGENT: string | null;

    @ViewColumn()
    MAPPIC: string | null;

    @ViewColumn()
    SERIES: string | null;

    @ViewColumn()
    AGENT: string | null;

    @ViewColumn()
    PRJ_NO: string | null;

    @ViewColumn()
    PRJ_NAME: string | null;

    @ViewColumn()
    COUNTRY: string | null;

    @ViewColumn()
    MFGNO: string | null;

    @ViewColumn()
    ELV_NO: string | null;

    @ViewColumn()
    OPERATION: string | null;

    @ViewColumn()
    REQ: string | null;

    @ViewColumn()
    CUST_RQS: Date | null;

    @ViewColumn()
    DESSCH: Date | null;

    @ViewColumn()
    PRODSCH: Date | null;

    @ViewColumn()
    DESPROD: string | null;

    @ViewColumn()
    DESBMDATE: Date | null;

    @ViewColumn()
    MFG_SCHEDULE: string | null;

    @ViewColumn()
    MFGBMDATE: Date | null;

    @ViewColumn()
    EXPSHIP: Date | null;

    @ViewColumn()
    TURNOVER_STATUS: number | null;

    @ViewColumn()
    DUMMYCAR_NO: string | null;

    @ViewColumn()
    DUMMY_PRDN: string | null;

    @ViewColumn()
    DUMMY_ITEM: string | null;

    @ViewColumn()
    BUYERCODE: string | null;

    @ViewColumn()
    BUYEREMPNO: string | null;

    @ViewColumn()
    BUYERNAME: string | null;

    @ViewColumn()
    PRNO: number | null;

    @ViewColumn()
    LINENO: number | null;

    @ViewColumn()
    PRDATE: number | null;

    @ViewColumn()
    PONO: number | null;

    @ViewColumn()
    PODATE: number | null;

    @ViewColumn()
    VENDCODE: number | null;

    @ViewColumn()
    VENDNAME: number | null;

    @ViewColumn()
    ITEM: string | null;

    @ViewColumn()
    PARTNAME: string | null;

    @ViewColumn()
    DRAWING: string | null;

    @ViewColumn()
    REMARK: string | null;

    @ViewColumn()
    REQUESTED_QTY: number | null;

    @ViewColumn()
    ORDERED_QTY: number | null;

    @ViewColumn()
    RECIEVE_QTY: number | null;

    @ViewColumn()
    DUEDATE: number | null;

    @ViewColumn()
    QTY: number | null;

    @ViewColumn()
    ACTUALETA_AMEC: number | null;

    @ViewColumn()
    INVOICE: string | null;

    @ViewColumn()
    C_DBP: string | null;

    @ViewColumn()
    REGISDATE: Date | null;
}
