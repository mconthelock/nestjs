import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('SP_INQUIRY')
export class Inquiry {
  @PrimaryColumn()
  INQ_ID: number;

  @Column()
  INQ_NO: string;

  @Column()
  INQ_REV: string;

  @Column()
  INQ_STATUS: string;

  @Column()
  INQ_DATE: string;

  @Column()
  INQ_TRADER: string;

  @Column()
  INQ_AGENT: string;

  @Column()
  INQ_COUNTRY: string;

  @Column()
  INQ_TYPE: string;

  @Column()
  INQ_PRJNO: string;

  @Column()
  INQ_PRJNAME: string;

  @Column()
  INQ_SHOPORDER: string;

  @Column()
  INQ_SERIES: string;

  @Column()
  INQ_OPERATION: string;

  @Column()
  INQ_SPEC: string;

  @Column()
  INQ_PRDSCH: string;

  @Column()
  INQ_QUOTATION_TYPE: string;

  @Column()
  INQ_DELIVERY_TERM: string;

  @Column()
  INQ_DELIVERY_METHOD: string;

  @Column()
  INQ_SHIPMENT: string;

  @Column()
  INQ_MAR_PIC: string;

  @Column()
  INQ_FIN_PIC: string;

  @Column()
  INQ_PKC_PIC: string;

  @Column()
  INQ_MAR_SENT: string;

  @Column()
  INQ_MRE_RECV: string;

  @Column()
  INQ_MRE_FINISH: string;

  @Column()
  INQ_PKC_FINISH: string;

  @Column()
  INQ_BM_DATE: string;

  @Column()
  INQ_FIN_RECV: string;

  @Column()
  INQ_FIN_FINISH: string;

  @Column()
  INQ_FINISH: string;

  @Column()
  INQ_MAR_REMARK: string;

  @Column()
  INQ_DES_REMARK: string;

  @Column()
  INQ_FIN_REMARK: string;

  @Column()
  CREATE_AT: string;

  @Column()
  UPDATE_AT: string;

  @Column()
  CREATE_BY: string;

  @Column()
  UPDATE_BY: string;

  @Column()
  INQ_LATEST: string;

  @Column()
  TOTAL_FC: string;

  @Column()
  TOTAL_TC: string;

  @Column()
  GRAND_TOTAL: string;

  @Column()
  TOTAL_UNIT_PRICE: string;

  @Column()
  INQ_PKC_REQ: string;

  @Column()
  INQ_EXTEND: string;

  @Column()
  INQ_CUR: string;

  @Column()
  INQ_ACTUAL_PO: string;

  @Column()
  INQ_CUSTRQS: string;

  @Column()
  INQ_FIN_CHK: string;

  @Column()
  INQ_FIN_CONFIRM: string;

  @Column()
  INQ_FIN_CHECKED: string;

  @Column()
  INQ_COMPARE_DATE: string;

  @Column()
  INQ_CUSTOMER: string;

  @Column()
  INQ_CONTRACTOR: string;

  @Column()
  INQ_ENDUSER: string;

  @Column()
  INQ_PORT: string;

  @Column()
  INQ_USERPART: string;

  @Column()
  INQ_TCCUR: string;
}
