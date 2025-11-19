import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { ItemsCustomer } from '../../items-customer/entities/items-customer.entity';
import { Ratio } from '../../ratio/entities/ratio.entity';

@Entity('DS_CUSTOMER')
export class Customer {
  @PrimaryColumn()
  CUS_ID: number;

  @Column()
  CUS_NAME: string;

  @Column()
  CUS_DISPLAY: string;

  @Column()
  CUS_AGENT: string;

  @Column()
  CUS_COUNTRY: string;

  @Column()
  CUS_CURENCY: string;

  @Column()
  CUS_TERM: string;

  @Column()
  CUS_PROJECT_PREFIX: string;

  @Column()
  CUS_ADDRESS: string;

  @Column()
  CUS_CONTACT: string;

  @Column()
  CUS_EMAIL: string;

  @Column()
  CUS_QUOTATION: number;

  @Column()
  CUS_LT: number;

  @Column()
  CUS_ADJUST: number;

  @OneToMany(() => ItemsCustomer, (item) => item.customer)
  @JoinColumn({ name: 'CUS_ID', referencedColumnName: 'CUSTOMER_ID' })
  items: ItemsCustomer;

  @OneToOne(() => Ratio, (item) => item.direct)
  @JoinColumn({ name: 'CUS_QUOTATION', referencedColumnName: 'QUOTATION' })
  rate: Ratio;
}
