import { Column, Entity, PrimaryColumn, JoinColumn, OneToMany } from 'typeorm';
import { Pricelist } from '../../pricelist/entities/pricelist.entity';
import { ItemsCustomer } from '../../items-customer/entities/items-customer.entity';

@Entity('DS_ITEM')
export class Items {
  @PrimaryColumn()
  ITEM_ID: number;

  @Column()
  ITEM_NO: string;

  @Column()
  ITEM_NAME: string;

  @Column()
  ITEM_DWG: string;

  @Column()
  ITEM_VARIABLE: string;

  @Column()
  ITEM_TYPE: number;

  @Column()
  ITEM_CLASS: string;

  @Column()
  ITEM_UNIT: string;

  @Column()
  ITEM_SUPPLIER: string;

  @Column()
  CATEGORY: number;

  @Column()
  ITEM_REMARK: string;

  @Column()
  ITEM_CUS_PUR: string;

  @Column()
  ITEM_AMEC_PUR: string;

  @Column()
  ITEM_MODEL: string;

  @Column()
  ITEM_STATUS: number;

  @Column()
  ITEM_THUMB: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  CREATE_AT: Date;

  @Column()
  CREATE_BY: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  UPDATE_AT: Date;

  @Column()
  UPDATE_BY: string;

  @OneToMany(() => Pricelist, (prs) => prs.itemdesc)
  prices: Pricelist[];

  @OneToMany(() => ItemsCustomer, (prs) => prs.itemdesc)
  itemscustomer: ItemsCustomer[];
}
