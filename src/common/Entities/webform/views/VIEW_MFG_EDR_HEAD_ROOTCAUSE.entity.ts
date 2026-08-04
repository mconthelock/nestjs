import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'VIEW_MFG_EDR_HEAD_ROOTCAUSE',
  schema: 'WEBFORM',
})
export class VIEW_MFG_EDR_HEAD_ROOTCAUSE {
  @PrimaryColumn()
  NFRMNO: number;

  @PrimaryColumn()
  VORGNO: string;

  @PrimaryColumn()
  CYEAR: string;

  @PrimaryColumn()
  CYEAR2: string;

  @PrimaryColumn()
  NRUNNO: number;

  @Column({ nullable: true })
  TID: number;

  @Column({ nullable: true })
  SSECCODE: string;

  @Column({ nullable: true })
  CID: number;

  @Column({ nullable: true })
  REPAIR_BY: string;

  @Column({ nullable: true })
  DAILY_MONTH: string;

  @Column({ nullable: true })
  DAILY_RUNNO: number;

  @Column({ nullable: true })
  REASON_CAUSE: string;

  @Column({ nullable: true })
  FYEAR: number;

  @Column({ nullable: true })
  SSEC: string;

  @Column({ nullable: true })
  CAUSE: string;

  @Column({ nullable: true })
  CAUSENAME: string;
}