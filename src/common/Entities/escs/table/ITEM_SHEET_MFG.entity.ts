import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ITEM_MFG } from './ITEM_MFG.entity';
import { ITEM_MFG_LIST } from './ITEM_MFG_LIST.entity';

@Entity({ name: 'ITEM_SHEET_MFG', schema: 'ESCCHKSHT' })
export class ITEM_SHEET_MFG {
  @PrimaryGeneratedColumn()
  NID: number;

  @Column()
  NITEMID: number;

  @Column()
  VSHEET_NAME: string;

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

  @OneToMany(() => ITEM_MFG_LIST, (item) => item.SHEET)
  ITEM_LIST: ITEM_MFG_LIST[];

  @ManyToOne(() => ITEM_MFG, (i) => i.SHEET)
  @JoinColumn({ name: 'NITEMID', referencedColumnName: 'NID' })
  ITEM: ITEM_MFG;
}
