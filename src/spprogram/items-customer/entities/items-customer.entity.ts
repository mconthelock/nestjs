import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Items } from '../../items/entities/items.entity';

@Entity('DS_CUSTOMER_ITEM')
export class ItemsCustomer {
  @PrimaryColumn()
  CUSTOMER_ID: number;

  @PrimaryColumn()
  ITEMS_ID: number;

  @Column()
  CREATE_BY: string;

  @Column()
  UPDATE_BY: string;

  @ManyToOne(() => Items, (item) => item.customers)
  @JoinColumn({ name: 'ITEMS_ID', referencedColumnName: 'ITEM_ID' })
  itemdesc: Items;
}
