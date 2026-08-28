import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'RNSOLVE', schema: 'WEBFORM' })
export class RNSOLVE {
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
  CMID: number;

  @Column()
  CSID: number;

  @Column()
  METHOD: string;

  @Column()
  DUEDATE: Date;

  @Column()
  PERSON: string;

  @Column()
  CHECKER: string;
}