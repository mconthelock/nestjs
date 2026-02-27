import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ITEM_SHEET_MFG } from './ITEM_SHEET_MFG.entity';
import { ITEM_MFG_HISTORY } from './ITEM_MFG_HISTORY.entity';
import { ITEM_MFG } from './ITEM_MFG.entity';

@Entity({ name: 'ITEM_MFG_LIST', schema: 'ESCCHKSHT' })
export class ITEM_MFG_LIST {
  @PrimaryGeneratedColumn()
  NID: number;

  @Column()
  NITEMID: number;

  @Column()
  VDRAWING: string;

  @Column()
  NSHEETID: number;

  @Column()
  VNUMBER_FILE: string;

  @Column()
  VREMARK: string;

  @Column()
  NSTATUS: number;

  @Column()
  NUSERCREATE: number;

  @Column()
  DDATECREATE: Date;

  @Column()
  NUSERUPDATE: number;

  @Column()
  DDATEUPDATE: Date;

  @ManyToOne(() => ITEM_SHEET_MFG, (s) => s.ITEM_LIST)
  @JoinColumn({ name: 'NSHEETID', referencedColumnName: 'NID' })
  SHEET: ITEM_SHEET_MFG;

  @OneToMany(() => ITEM_MFG_HISTORY, (h) => h.ITEM)
  HISTORY: ITEM_MFG_HISTORY[];

  @ManyToOne(() => ITEM_MFG, (s) => s.ITEM_LIST)
  @JoinColumn({ name: 'NITEMID', referencedColumnName: 'NID' })
  ITEM: ITEM_MFG;
}
