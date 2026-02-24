import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ITEM_MFG_LIST } from './ITEM_MFG_LIST.entity';

@Entity({ name: 'ITEM_MFG_HISTORY', schema: 'ESCCHKSHT' })
export class ITEM_MFG_HISTORY {
  @PrimaryGeneratedColumn()
  NID: number;

  @Column()
  NITEMLISTID: number;

  @Column()
  NMARKNUM: number;

  @Column()
  VMARK: string;

  @Column()
  VMARK_REMARK: string;

  @Column()
  VINCHARGE: string;

  @Column()
  VINCHARGE_REMARK: string;

  @Column()
  NSTATUS: number;

  @Column()
  NUSERUPDATE: number;

  @Column()
  DDATEUPDATE: Date;

  @ManyToOne(() => ITEM_MFG_LIST, (i) => i.HISTORY)
  @JoinColumn({ name: 'NITEMLISTID', referencedColumnName: 'NID' })
  ITEM: ITEM_MFG_LIST;
}
