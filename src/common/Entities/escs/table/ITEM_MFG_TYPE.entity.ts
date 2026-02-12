import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ITEM_MFG_TYPE', schema: 'ESCCHKSHT' })
export class ITEM_MFG_TYPE {
  @PrimaryColumn()
  NTYPE: number;

  @Column()
  VDESCRIPTION: string;
  
  @Column()
  DDATECREATE: Date;
}
