import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'EBGREQCOL_IMAGE', schema: 'EBUDGET' })
export class EBGREQCOL_IMAGE {
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
  COLNO: number;

  @PrimaryColumn()
  ID: string;

  @Column()
  IMAGE_FILE: string;
}
