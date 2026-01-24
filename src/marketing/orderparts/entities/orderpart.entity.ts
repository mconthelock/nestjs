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
  CAR_NO: string;

  @Column()
  IDS_DATE: string;

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
}
