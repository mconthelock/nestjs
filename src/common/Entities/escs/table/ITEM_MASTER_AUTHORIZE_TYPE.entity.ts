import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ITEM_MASTER_AUTHORIZE } from './ITEM_MASTER_AUTHORIZE.entity';

@Entity({ name: 'ITEM_MASTER_AUTHORIZE_TYPE', schema: 'ESCCHKSHT' })
export class ITEM_MASTER_AUTHORIZE_TYPE {
  @PrimaryColumn()
  NTYPE: number;

  @Column()
  VDESCRIPTION: string;

  @Column()
  DDATECREATE: Date;

  @OneToMany(() => ITEM_MASTER_AUTHORIZE, (i) => i.TYPE_DETAIL)
  AUTHORIZE: ITEM_MASTER_AUTHORIZE[];
}
    