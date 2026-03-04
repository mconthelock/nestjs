import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ITEM_MFG } from './ITEM_MFG.entity';

@Entity({ name: 'BLOCK_MASTER', schema: 'ESCCHKSHT' })
export class BLOCK_MASTER {
  @PrimaryGeneratedColumn()
  NID: number;

  @Column()
  VNAME: string;

  @Column()
  VCODE: string;

  @Column()
  NUSERCREATE: number;

  @Column()
  DDATECREATE: Date;

  @Column()
  NUSERUPDATE: number;

  @Column()
  DDATEUPDATE: Date;

  @Column()
  NSTATUS: number;

  @OneToMany(() => ITEM_MFG, (i) => i.BLOCK_MASTER)
  ITEM_MFG: ITEM_MFG[];
}
