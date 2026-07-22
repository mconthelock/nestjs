import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'RNFRM', schema: 'WEBFORM' })
export class RNFRM {
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
  TID: number;

  @Column()
  SECCODE: string;

  @Column()
  CID: number;

  @Column()
  WID: number;

  @Column()
  PRONG: string;

  @Column()
  EXPLAIN: string;

  @Column()
  REJECTPRE: string;

  @Column()
  REJECTNO: number;

  @Column()
  STATUS: string;

  @Column()
  SOLVPROB: string;

  @Column()
  SECOTH: string;
}