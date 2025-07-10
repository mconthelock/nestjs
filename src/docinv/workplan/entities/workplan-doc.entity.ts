import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('WORK_DOCUMENTS')
export class WorkplanDoc {
  @PrimaryColumn()
  PLANID: number;

  @PrimaryColumn()
  DOCTYPE: string;

  @PrimaryColumn()
  FGROUP: string;

  @PrimaryColumn()
  SEQ: number;

  @Column()
  FNAME: string;

  @Column()
  FTYPE: string;

  @Column()
  LOCATION: string;
}
