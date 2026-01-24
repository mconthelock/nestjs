import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('TMARKET_TEMP_PARTS')
export class Orderpart {
  @Column()
  SERIES: string;

  @Column()
  AGENT: string;

  @Column()
  PRJ_NO: string;

  @Column()
  PRJ_NAME: string;

  @Column()
  DSTN: string;

  @Column()
  ORDER_NO: string;

  @Column()
  SPEC: string;

  @Column()
  OPERATION: string;

  @PrimaryColumn()
  MFGNO: string;

  @Column()
  ELV_NO: string;

  @Column()
  CAR_NO: string;

  @Column()
  IDS_DATE: Date;

  @Column()
  AMEC_SCHDL: Date;

  @Column()
  AMEC_REQ_SHIP: Date;

  @Column()
  INV_A_NUMBER: string;

  @Column()
  INV_A_DATE: Date;

  @Column()
  P_O_DATE: Date;

  @Column()
  TRADER: string;

  @Column()
  CUST_RQS: string;

  @Column()
  INQUIRY_NO: string;

  @Column()
  RECON_PARTS: string;

  @PrimaryColumn()
  EDIT_DATE: string;

  @PrimaryColumn()
  REVISION_CODE: string;

  @PrimaryColumn()
  REVISION_EDIT: string;

  @Column()
  PART_CATEGORY: string;

  @Column()
  CREATEBY: string;

  @Column()
  PO_MELTEC: string;

  @Column()
  DWGNO_MELTEC: string;

  @Column()
  PARTNAME_MELTEC: string;

  @Column()
  SPEC_MELTEC: string;
}
