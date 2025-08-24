import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { InquiryDetail } from '../../inquiry-detail/entities/inquiry-detail.entity';

@Entity('SP_INQUIRY_LOG')
export class InquiryLog {
  @PrimaryColumn()
  LOG_DATE: Date;

  @Column()
  INQD_ID: number;

  @Column()
  INQD_SEQ: number;

  @Column()
  INQD_RUNNO: number;

  @Column()
  INQD_MFGORDER: string;

  @Column()
  INQD_ITEM: string;

  @Column()
  INQD_CAR: string;

  @Column()
  INQD_PARTNAME: string;

  @Column()
  INQD_DRAWING: string;

  @Column()
  INQD_VARIABLE: string;

  @Column()
  INQD_QTY: number;

  @Column()
  INQD_UM: string;

  @Column()
  INQD_SUPPLIER: string;

  @Column()
  INQD_SENDPART: number;

  @Column()
  INQD_UNREPLY: number;

  @Column()
  INQD_FC_COST: number;

  @Column()
  INQD_TC_COST: number;

  @Column()
  INQD_UNIT_PRICE: number;

  @Column()
  INQD_FC_BASE: number;

  @Column()
  INQD_TC_BASE: number;

  @Column()
  INQD_MAR_REMARK: string;

  @Column()
  INQD_DES_REMARK: string;

  @Column()
  INQD_FIN_REMARK: string;

  @Column()
  CREATE_AT: Date;

  @Column()
  CREATE_BY: string;

  @Column()
  UPDATE_AT: Date;

  @Column()
  UPDATE_BY: string;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  @ManyToOne(() => InquiryDetail, (detail) => detail.logs)
  @JoinColumn({ name: 'INQD_ID', referencedColumnName: 'INQD_ID' })
  details: InquiryDetail;
}
