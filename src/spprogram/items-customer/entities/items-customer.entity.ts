import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Items } from '../../items/entities/items.entity';
import { Customer } from '../../customer/entities/customer.entity';

@Entity('DS_CUSTOMER_ITEM')
export class ItemsCustomer {
  @PrimaryColumn()
  CUSTOMER_ID: number;

  @PrimaryColumn()
  ITEMS_ID: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
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

  @ManyToOne(() => Items, (item) => item.itemscustomer)
  @JoinColumn({ name: 'ITEMS_ID', referencedColumnName: 'ITEM_ID' })
  itemdesc: Items;

  @ManyToOne(() => Customer, (item) => item.items)
  @JoinColumn({ name: 'CUSTOMER_ID', referencedColumnName: 'CUS_ID' })
  customer: Customer;
}
