import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'AMECORDERS' })
export class AmecOrders {

  @PrimaryColumn()
  MFGNO: string;

  @Column()
  REVISION: string;

  @Column()
  PONO: string;

  @Column()
  PRODTYPE: string;

  @Column()
  SERIES: string;

  @Column()
  IDS_DATE: Date;

  @Column()
  CUSTOMER_REQ: Date;

  @Column()
  MAINQTY: number;

  @Column()
  PARTQTY: number;

  @Column()
  PRJ_NO: string;

  @Column()
  PRJ_NAME: string;

  @Column()
  AGENT: string;

  @Column()
  COUNTRY: string;

  @Column()
  SALE_COMPANY: string;

  @Column()
  PORT: string;

  @Column()
  STATUS: number;

  @Column()
  REMARK: string;

  @Column()
  SPEC: string;
}