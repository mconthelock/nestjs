import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'EBGREQFORM', schema: 'EBUDGET' })
export class EBGREQFORM {
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
  ID: string;

  @Column()
  FYEAR: string;

  @Column()
  SCATALOG: string;

  @Column()
  RECBG: number;

  @Column()
  USEDBG: number;

  @Column()
  REMBG: number;

  @Column()
  REQAMT: number;

  @Column()
  RESORG: string;

  @Column()
  PIC: string;

  @Column()
  FINDATE: Date;

  @Column()
  ITMNAME: string;

  @Column()
  PURPOSE: string;

  @Column()
  DETPLAN: string;

  @Column()
  INVDET: string;

  @Column()
  EFFT: string;

  @Column()
  SCHEDULE: string;

  @Column()
  REMARK: string;

  @Column()
  PPRESDATE: Date;

  @Column()
  PRREFNO: string;

  @Column()
  SVENDCODE: string;

  @Column()
  GPBID: string;

  @Column()
  GPFYEAR: string;
}
