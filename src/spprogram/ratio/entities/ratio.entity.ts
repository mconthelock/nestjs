import {
  Entity,
  PrimaryColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { QuotationType } from '../../quotation-type/entities/quotation-type.entity';
import { Customer } from 'src/spprogram/customer/entities/customer.entity';

@Entity('SP_PRICE_RATIO')
export class Ratio {
  @PrimaryColumn()
  ID: number;

  @Column()
  TRADER: string;

  @Column()
  SUPPLIER: string;

  @Column()
  QUOTATION: number;

  @Column({
    name: 'FORMULA',
    type: 'decimal',
    precision: 7,
    scale: 3,
  })
  FORMULA: number;

  @Column()
  FREIGHT_SEA: number;

  @Column()
  FREIGHT_AIR: number;

  @Column()
  FREIGHT_COURIER: number;

  @Column()
  UPDATE_BY: string;

  @Column()
  UPDATE_AT: Date;

  @Column()
  CURRENCY: string;

  @Column()
  STATUS: number;

  @ManyToOne(() => QuotationType, (q) => q.ratio)
  @JoinColumn({ name: 'QUOTATION', referencedColumnName: 'QUOTYPE_ID' })
  quoText: QuotationType;

  @OneToOne(() => Customer, (item) => item.rate)
  @JoinColumn({ name: 'QUOTATION', referencedColumnName: 'CUS_QUOTATION' })
  direct: Customer;
}
