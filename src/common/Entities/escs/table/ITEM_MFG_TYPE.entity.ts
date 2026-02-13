import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ITEM_MFG } from './ITEM_MFG.entity';

@Entity({ name: 'ITEM_MFG_TYPE', schema: 'ESCCHKSHT' })
export class ITEM_MFG_TYPE {
  @PrimaryColumn()
  NTYPE: number;

  @Column()
  VDESCRIPTION: string;

  @Column()
  DDATECREATE: Date;

  @OneToMany(() => ITEM_MFG, (i) => i.ITEM_MFG_TYPE)
  ITEM_MFG: ITEM_MFG[];
}
