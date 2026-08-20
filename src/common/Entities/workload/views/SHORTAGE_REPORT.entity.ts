import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
  name: 'VW_SHORTAGE_REPORT',
  schema: 'WORKLOAD',
})
export class VW_SHORTAGE_REPORT {
  //หมายเลขผู้ซื้อ  
  @ViewColumn()
  BUYER: string;
  
  @ViewColumn()
  JOBITEM: string;
  
  @ViewColumn()
  ITEM: string;
  
  @ViewColumn()
  DRAWING: string;
  
  @ViewColumn()
  DESCRIPTION: string;
  
  @ViewColumn()
  ONHAND: number;
  
  @ViewColumn()
  ALLOCAT: number;
  
  @ViewColumn({ name: 'TOTAL_QTY' })
  BALANCE: number;
  
  @ViewColumn()
  QTY_N5: string;
  
  @ViewColumn()
  QTY_N4: string;
  
  @ViewColumn()
  QTY_N3: string;
  
  @ViewColumn()
  QTY_N2: string;
  
  @ViewColumn()
  QTY_N1: string;
  
  @ViewColumn()
  QTY_N0: string;
  
  @ViewColumn({ name: 'TOTAL_QTY' })
  TOTAL_SHORT: number;
  
  @ViewColumn({ name: 'PVEND' })
  VENCODE: number;
  
  @ViewColumn()
  VNDNAM: string;
  
  //หมายเลข PO
  @ViewColumn()
  PONO: number;

  //หมายเลข Item ของ PO
  @ViewColumn()
  PORD: string;

  //บรรทัดที่ของ PO
  @ViewColumn()
  PLINE: number;

  //จำนวน REQUEST
  @ViewColumn()
  PO_RQ : number;

  //จำนวน ALLOCATE (จำนวนที่รอรับ)
  @ViewColumn()
  REMAIN_PO: number;
  
  //วันที่ต้องการรับสินค้า
  @ViewColumn()
  DUEDATE: number;
  
  @ViewColumn()
  ETD: Date;

  @ViewColumn()
  ETA: Date;

  @ViewColumn()
  SHIP_MODE: string;

  @ViewColumn()
  ARV_AMEC: Date;

  @ViewColumn()
  ARV_QTY: number;

  @ViewColumn()
  INV_NO: string;
  //COMMENT
  @ViewColumn()
  COMMENT_PUR: string;
  
  //NEXT_REPLY
  @ViewColumn()
  NEXT_REPLY: Date;
  
  //CAUSE_OF
  @ViewColumn()
  CAUSE_OF: string;
  
  //REMARK
  @ViewColumn()
  REMARK: string;

  //UPDATE DATE
  @ViewColumn()
  UPDATE_DATE: Date;
  
  //USER UPDATE
  @ViewColumn()
  USER_UPDATE: string;

}