import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'A_TABLE_CHECK', schema: 'AMECMFG' })
export class TableCheck {
  @PrimaryColumn()
  ID: number;

  @Column()
  TB_LIBRARY: string;

  @Column()
  TB_NAME: string;

  @Column()
  TB_SOURCE: string;

  @Column()
  TB_EXTRACT: string;

  @Column()
  TB_STATUS: number;

  @Column()
  CONDITIONS: string;

  @Column()
  PIC: string;

  @Column()
  REMARK: string;

  @Column()
  KEY_COLUMN: string;

  @Column()
  SOURCE_REC: number;

  @Column()
  TARGET_REC: number;

  @Column()
  TB_COLS: string;

  @Column()
  SOURCE_CHECK: Date;

  @Column()
  TARGET_CHECK: Date;

  @Column()
  LAST_SYNC: Date;

  @Column()
  DEFAULTJRN: string;

  @Column()
  TB_DATABASE: string;

  @Column()
  SKIPCHECK: string;

  @Column()
  GROUP_NAME: string;

  @Column()
  SEQNO: number;

  @Column()
  RBA: number;

  @Column()
  AUDIT_TS: string;

  @Column()
  LAST_UPDATE: string;

  @Column()
  ROWNUMS: number;

  @Column()
  SOURCECHECK: string;

  @Column()
  TARGETCHECK: string;
}
