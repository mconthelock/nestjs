import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'RQFFRM', schema: 'WEBFORM' })
export class RQFFRM {
  @PrimaryColumn()
  NFRMNO: number;

  @PrimaryColumn()
  VORGNO: string;

  @PrimaryColumn()
  CYEAR: string;

  @PrimaryColumn()
  CYEAR2: string;

  @PrimaryColumn()
  NRUNNO: number;

  @Column()
  REASON: string;

  @Column()
  REQ: string;

  @Column()
  URGENT: string;

  @Column()
  PRICE: string;

  @Column()
  TERM: string;

  @Column()
  OTHER: string;

  @Column()
  NOTEOTH: string;

  @Column()
  REQDATE: Date;

  @Column()
  PURINC: string;

  @Column()
  PURID: string;

  @Column()
  TYPEQUO: string;

  @Column()
  TYPEPUR: string;

  @Column()
  JOPITM: string;

  @Column()
  OWNBUY: string;

  @Column()
  TYPEPRO: string;

  @Column()
  BCOMMENT: string;

  @Column()
  TYPEPRO1: string;

  @Column()
  ID: string;

  @Column()
  SEXPTYPE: number;

  @Column()
  GEN_PR: string;

  @Column()
  OVER_10K: string;

  @Column()
  BIDDING_NO: string;

  @Column()
  SPRNO: string;

  @Column()
  FYEAR: string;

  @Column()
  SDELIVERY: string;

  @Column()
  DDELIVERY: Date;
}
