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

  @Column()
  PRICE: number;

  @Column()
  CURRENCY: number;

  @Column()
  TOTAL: number;

  @Column()
  CURRYEAR: number;

  @Column()
  CURRSECT: number;

  @Column()
  CURRCODE: string;
}
