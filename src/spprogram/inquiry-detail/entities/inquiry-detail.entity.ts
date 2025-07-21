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
  INQD_ID: string;

  @Column()
  INQG_GROUP: string;

  @Column()
  INQD_SEQ: string;

  @Column()
  INQD_RUNNO: string;

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
  INQD_QTY: string;

  @Column()
  INQD_UM: string;

  @Column()
  INQD_SUPPLIER: string;

  @Column()
  INQD_SENDPART: string;

  @Column()
  INQD_UNREPLY: string;

  @Column()
  INQD_FC_COST: string;

  @Column()
  INQD_TC_COST: string;

  @Column()
  INQD_UNIT_PRICE: string;

  @Column()
  INQD_FC_BASE: string;

  @Column()
  INQD_TC_BASE: string;

  @Column()
  INQD_MAR_REMARK: string;

  @Column()
  INQD_DES_REMARK: string;

  @Column()
  INQD_FIN_REMARK: string;

  @Column()
  INQD_LATEST: string;

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
  ITEMID: string;

  @Column()
  INQID: string;

  @Column()
  TEST_FLAG: string;

  @Column()
  TEST_MESSAGE: string;

  @Column()
  AUTO_ADD: string;

  @Column()
  INQD_PREV: string;

  @Column()
  UPDATE_CODE: string;

  @Column()
  INQD_EXRATE: string;
}
