import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('WORK_PLAN_ALL')
export class IsWorkLoad {
  @PrimaryColumn()
  NFRMNO: string;

  @PrimaryColumn()
  VORGNO: string;

  @PrimaryColumn()
  CYEAR: string;

  @PrimaryColumn()
  CYEAR2: number;

  @PrimaryColumn()
  NRUNNO: number;

  @Column()
  WORKTYPE: number;

  @Column()
  WORKCATEGORY: string;

  @Column()
  PLANYEAR: number;

  @Column()
  REQNO: string;

  @Column()
  TITLE: string;

  @Column()
  DETAIL: string;

  @Column()
  VSYSNAME: string;

  @Column()
  DPDATE: Date;

  @Column()
  DPEDATE: Date;

  @Column()
  NTYPEID: string;

  @Column()
  VTYPEDESC: string;

  @Column()
  STATUS: string;

  @Column()
  REQUESTER: string;

  @Column()
  DEVELOPER: string;
}
