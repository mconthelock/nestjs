import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'A_TABLE_LIST', schema: 'AMECMFG' })
export class TableList {
  @PrimaryGeneratedColumn()
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
}
