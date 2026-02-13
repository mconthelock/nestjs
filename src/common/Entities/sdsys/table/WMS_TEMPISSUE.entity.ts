import { Column, PrimaryColumn, Entity } from 'typeorm';

@Entity({ name: 'WMS_TEMPISSUE_TEST', schema: 'SDSYS' })
export class WMSTempIssueEntity {
  @PrimaryColumn()
  USERID: string;

  @PrimaryColumn()
  ISSUE: string;

  @PrimaryColumn()
  STATUS: string;

  @PrimaryColumn()
  ITEMCODE: string;

  @Column()
  DESCRIPTION: string;

  @Column()
  PROD: string;

  @PrimaryColumn()
  LOCATION: string;

  @Column()
  QTY: number;

  @Column()
  ISSUETO: string;

  @PrimaryColumn()
  PO: string;

  @Column()
  LINE: string;

  @Column()
  INV: string;

  @PrimaryColumn()
  PALLET_ID: string;

  @Column()
  EXPIRE_DATE: string;
}

