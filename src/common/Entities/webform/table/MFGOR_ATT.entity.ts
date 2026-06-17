import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'MFGOR_ATT' })
export class Mfgor_att {
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
  FILENAME: string | null;
}