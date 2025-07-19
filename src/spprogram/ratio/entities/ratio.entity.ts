import { Entity, PrimaryColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { QuotationType } from '../../quotation-type/entities/quotation-type.entity';

@Entity('SP_PRICE_RATIO')
export class Ratio {
  @PrimaryColumn()
  ID: string;

  @Column()
  TRADER: string;

  @Column()
  SUPPLIER: string;

  @Column()
  QUOTATION: string;

  @Column()
  FORMULA: string;

  @Column()
  FREIGHT_SEA: string;

  @Column()
  FREIGHT_AIR: string;

  @Column()
  FREIGHT_COURIER: string;

  @Column()
  UPDATE_BY: string;

  @Column()
  UPDATE_AT: string;

  @Column()
  CURRENCY: string;

  @Column()
  STATUS: string;

  @ManyToOne(() => QuotationType, (q) => q.ratio)
  @JoinColumn({ name: 'QUOTATION', referencedColumnName: 'QUOTYPE_ID' })
  quoText: QuotationType;
}
