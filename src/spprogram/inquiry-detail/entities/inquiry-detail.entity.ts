import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('SP_INQUIRY_DETAIL')
export class InquiryDetail {
  @PrimaryColumn()
  INQD_ID: number;

  @Column()
  INQG_GROUP: number;

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
  INQD_LATEST: number;

  @Column()
  INQD_OWNER: string;

  @Column()
  CREATE_AT: string;

  @Column()
  CREATE_BY: string;

  @Column()
  UPDATE_AT: string;

  @Column()
  UPDATE_BY: string;

  @Column()
  INQD_COMPARE: string;

  @Column()
  INQD_COMPARE_DATE: string;

  @Column()
  INQD_OWNER_GROUP: string;

  @Column()
  ITEMID: number;

  @Column()
  INQID: number;

  @Column()
  TEST_FLAG: string;

  @Column()
  TEST_MESSAGE: string;

  @Column()
  AUTO_ADD: string;

  @Column()
  INQD_PREV: number;

  @Column()
  UPDATE_CODE: string;

  @Column()
  INQD_EXRATE: number;
}
