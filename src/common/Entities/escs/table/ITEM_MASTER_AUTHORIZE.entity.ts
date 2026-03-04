import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ITEM_MASTER_AUTHORIZE_TYPE } from './ITEM_MASTER_AUTHORIZE_TYPE.entity';

@Entity({ name: 'ITEM_MASTER_AUTHORIZE', schema: 'ESCCHKSHT' })
export class ITEM_MASTER_AUTHORIZE {
  @PrimaryGeneratedColumn()
  NID: number;

  @Column()
  VAUTH: string;

  @Column()
  NTYPE: number;

  @Column()
  DDATECREATE: Date;

  @Column()
  NSTATUS: number;

  @ManyToOne(() => ITEM_MASTER_AUTHORIZE_TYPE, (i) => i.AUTHORIZE)
  @JoinColumn({ name: 'NTYPE', referencedColumnName: 'NTYPE' })
  TYPE_DETAIL: ITEM_MASTER_AUTHORIZE_TYPE[];
}
