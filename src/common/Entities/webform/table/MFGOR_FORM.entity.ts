import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'MFGOR_FORM' })
export class Mfgor_form {
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
  TYPEFORM: string | null;

  @Column()
  CLASS: string | null;

  @Column()
  TOPIC: string | null;

  @Column()
  DWGNO: string | null;

  @Column()
  SHOPNO: string | null;

  @Column()
  ITEMNO: string | null;

  @Column()
  APPLY_FOR: string | null;

  @Column()
  SEQNO: number | null;

  @Column()
  ORNO: string | null;

  @Column()
  REV: string | null;
}