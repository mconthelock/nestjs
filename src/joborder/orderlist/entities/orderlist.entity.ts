import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'AMECMFG.JOB_ORDER' })
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
  MFGBMDATE: Date | null;
  @ViewColumn()
  EXPSHIP: Date | null;
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
  PRNO: Number | null;
  @ViewColumn()
  LINENO: Number | null;
  @ViewColumn()
  PRDATE: Number | null;
  @ViewColumn()
  PONO: Number | null;
  @ViewColumn()
  PODATE: Number | null;
  @ViewColumn()
  VENDCODE: Number | null;
  @ViewColumn()
  ITEM: string | null;
  @ViewColumn()
  PARTNAME: string | null;
  @ViewColumn()
  DRAWING: string | null;
  @ViewColumn()
  REMARK: string | null;
  @ViewColumn()
  REQUESTED_QTY: Number | null;
  @ViewColumn()
  ORDERED_QTY: Number | null;
  @ViewColumn()
  RECIEVE_QTY: Number | null;
  @ViewColumn()
  DUEDATE: Number | null;
  @ViewColumn()
  QTY: Number | null;
  @ViewColumn()
  ACTUALETA_AMEC: Number | null;
  @ViewColumn()
  INVOICE: string | null;
}
