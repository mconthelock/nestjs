import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'EBUDGET_QUOTATION_PRODUCT', schema: 'EBUDGET' })
export class EBUDGET_QUOTATION_PRODUCT {
  @PrimaryColumn()
  QUOTATION_ID: number;

  @PrimaryColumn()
  SEQ: number;

  @Column()
  SVENDCODE: string;

  @Column()
  SVENDNAME: string;

  @Column()
  PRODCODE: string;

  @Column()
  PRODNAME: string;

  @Column()
  UNITCODE: string;

  @Column()
  UNIT: string;

  @Column()
  QTY: number;

  @Column({type: 'decimal', precision: 10, scale: 2 })
  PRICE: number;

  @Column({type: 'decimal', precision: 10, scale: 2 })
  CURRENCY: number;

  @Column({type: 'decimal', precision: 10, scale: 2 })
  TOTAL: number;

  @Column()
  CURRYEAR: number;

  @Column()
  CURRSECT: number;

  @Column()
  CURRCODE: string;
}
