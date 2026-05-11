import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'A_TABLE_SYNC', schema: 'AMECMFG' })
export class TableSync {
  @PrimaryColumn()
  GROUP_NAME: string;

  @Column()
  SEQNO: string;

  @Column()
  RBA: string;

  @Column()
  AUDIT_TS: string;

  @Column()
  LAST_UPDATE: string;

  @Column()
  ROWNUMS: string;
}
