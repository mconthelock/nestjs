
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'MFGOR_CENTER' })
export class Mfgor_center {
  @PrimaryColumn()
  ORNO: string;

  @PrimaryColumn()
  CYEAR: string;

  @PrimaryColumn()
  SEQ: number;

  @Column()
  TOPIC: string | null;

  @Column()
  REVNO: string | null;

  @Column()
  ISSUE_DATE: Date | null;

  @Column()
  REVISE_DATE: Date | null;

  @Column()
  FORMNO: string | null;

}

