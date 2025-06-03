import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'JOB_ORDER' })
export class VJobOrder {
  @ViewColumn()
  id: number;

  @ViewColumn()
  jobTitle: string;

  @ViewColumn()
  department: string;

  @ViewColumn({ nullable: true })
  location?: string;

  @ViewColumn({ nullable: true })
  salary?: number;

  @ViewColumn()
  ORDTYPE;
  @ViewColumn()
  URGENT;
  @ViewColumn()
  MAPPIC;
  @ViewColumn()
  SERIES;
  @ViewColumn()
  AGENT;
  @ViewColumn()
  PRJ_NO;
  @ViewColumn()
  MFGNO;
  @ViewColumn()
  ELV_NO;
  @ViewColumn()
  OPERATION;
  @ViewColumn()
  REQ;
  @ViewColumn()
  CUST_RQS;
  @ViewColumn()
  DESSCH;
  @ViewColumn()
  PRODSCH;
  @ViewColumn()
  DESPROD;
  @ViewColumn()
  DESBMDATE;
  @ViewColumn()
  MFGBMDATE;
  @ViewColumn()
  EXPSHIP;
  @ViewColumn()
  DUMMYCAR_NO;
  @ViewColumn()
  DUMMY_PRDN;
  @ViewColumn()
  DUMMY_ITEM;
  @ViewColumn()
  BUYERCODE;
  @ViewColumn()
  BUYEREMPNO;
  @ViewColumn()
  BUYERNAME;
  @ViewColumn()
  PRNO;
  @ViewColumn()
  LINENO;
  @ViewColumn()
  PRDATE;
  @ViewColumn()
  PONO;
  @ViewColumn()
  PODATE;
  @ViewColumn()
  VENDCODE;
  @ViewColumn()
  ITEM;
  @ViewColumn()
  PARTNAME;
  @ViewColumn()
  DRAWING;
  @ViewColumn()
  REMARK;
  @ViewColumn()
  REQUESTED_QTY;
  @ViewColumn()
  ORDERED_QTY;
  @ViewColumn()
  RECIEVE_QTY;
  @ViewColumn()
  DUEDATE;
  @ViewColumn()
  QTY;
  @ViewColumn()
  ACTUALETA_AMEC;
  @ViewColumn()
  INVOICE;
}
