import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'RNLIST', schema: 'WEBFORM' })
export class RNLIST {
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

  @PrimaryColumn()
  ID: number;

  @Column()
  ORDERNO: string;

  @Column()
  DWGNO: string;

  @Column()
  PROJNO: string;

  @Column()
  PROD: string;

  @Column()
  ITEM: string;

  @Column()
  PART: string;

  @Column()
  MODEL: string;

  @Column()
  QTY: number;

  @Column()
  LOSS: number;

  @Column()
  REFNO: string;
}