import { PrimaryColumn, Column, Entity } from 'typeorm';

@Entity({ name: 'ORDERS', schema: 'ESCCHKSHT' })
export class Orders {
  @PrimaryColumn()
  ORD_PRODUCTION: string;

  @PrimaryColumn()
  ORD_NO: string;

  @PrimaryColumn()
  ORD_ITEM: string;

  @Column()
  ORD_MODEL: string;

  @Column()
  ORD_PROJECT: string;

  @Column({ default: '1' })
  ORD_STATUS: number;

  @Column()
  ORT_ID: number;

  @Column()
  ORD_P: string;

  @Column()
  ORD_REMARK: string;

  @Column()
  SEC_ID: number;
}
