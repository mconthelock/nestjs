import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'ITEM', schema: 'ESCCHKSHT' })
export class Item {
  @PrimaryColumn()
  IT_NO: string;

  @Column()
  IT_PATH: string | null;

  @Column()
  IT_FILE: string | null;

  @Column()
  IT_USERUPDATE: number | 0;

  @Column({
    type: 'date',
    default: () => 'SYSDATE',
  })
  IT_DATEUPDATE: Date | null;

  @Column({ default: 1 })
  IT_STATUS: number | 0;

  @Column()
  SEC_ID: number | 0;

  @Column()
  IT_QCDATE: number | 0;

  @Column()
  IT_MFGDATE: number | 0;
}
