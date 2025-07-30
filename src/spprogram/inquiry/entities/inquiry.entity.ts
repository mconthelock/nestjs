import { Column, Entity, PrimaryColumn, JoinColumn, OneToMany } from 'typeorm';
import { InquiryGroup } from '../../inquiry-group/entities/inquiry-group.entity';

@Entity('SP_INQUIRY')
export class Inquiry {
  @PrimaryColumn()
  INQ_ID: number;

  @Column()
  INQ_NO: string;

  @Column()
  INQ_REV: string;

  @Column()
  INQ_STATUS: number;

  @Column()
  INQ_DATE: Date;

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
  INQ_QUOTATION_TYPE: number;

  @Column()
  INQ_DELIVERY_TERM: number;

  @Column()
  INQ_DELIVERY_METHOD: number;

  @Column()
  INQ_SHIPMENT: number;

  @Column()
  INQ_MAR_PIC: string;

  @Column()
  INQ_FIN_PIC: string;

  @Column()
  INQ_PKC_PIC: string;

  @Column()
  INQ_MAR_SENT: Date;

  @Column()
  INQ_MRE_RECV: Date;

  @Column()
  INQ_MRE_FINISH: Date;

  @Column()
  INQ_PKC_FINISH: Date;

  @Column()
  INQ_BM_DATE: Date;

  @Column()
  INQ_FIN_RECV: Date;

  @Column()
  INQ_FIN_FINISH: Date;

  @Column()
  INQ_FINISH: Date;

  @Column()
  INQ_MAR_REMARK: string;

  @Column()
  INQ_DES_REMARK: string;

  @Column()
  INQ_FIN_REMARK: string;

  @Column()
  CREATE_AT: Date;

  @Column()
  UPDATE_AT: Date;

  @Column()
  CREATE_BY: string;

  @Column()
  UPDATE_BY: string;

  @Column()
  INQ_LATEST: number;

  @Column()
  TOTAL_FC: number;

  @Column()
  TOTAL_TC: number;

  @Column()
  GRAND_TOTAL: number;

  @Column()
  TOTAL_UNIT_PRICE: number;

  @Column()
  INQ_PKC_REQ: number;

  @Column()
  INQ_EXTEND: number;

  @Column()
  INQ_CUR: string;

  @Column()
  INQ_ACTUAL_PO: string;

  @Column()
  INQ_CUSTRQS: Date;

  @Column()
  INQ_FIN_CHK: string;

  @Column()
  INQ_FIN_CONFIRM: Date;

  @Column()
  INQ_COMPARE_DATE: Date;

  @Column()
  INQ_CUSTOMER: number;

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

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  @OneToMany(() => InquiryGroup, (group) => group.inqs)
  @JoinColumn({ name: 'INQ_ID', referencedColumnName: 'INQ_ID' })
  inqgroup: InquiryGroup;
}
