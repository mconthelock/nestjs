import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'EBGREQATTFILE', schema: 'EBUDGET' })
export class EBGREQATTFILE {
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
  TYPENO: number;

  @PrimaryColumn()
  ID: string;

  @Column()
  SFILE: string;

  @Column()
  OFILE: string;
}
