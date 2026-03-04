import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'OTFORM' })
export class Overtime {

  @PrimaryColumn({ name: 'NFRMNO', type: 'number' })
  NFRMNO: number;

  @PrimaryColumn({ name: 'VORGNO', type: 'varchar2', length: 6 })
  VORGNO: string;

  @PrimaryColumn({ name: 'CYEAR', type: 'char', length: 2 })
  CYEAR: string;

  @PrimaryColumn({ name: 'CYEAR2', type: 'char', length: 4 })
  CYEAR2: string;

  @PrimaryColumn({ name: 'NRUNNO', type: 'number' })
  NRUNNO: number;

  @PrimaryColumn({ name: 'EMPNO', type: 'varchar2', length: 12 })
  EMPNO: string;

  @Column()
  WORKDATE: Date;

  @Column()
  TIMEIN?: string;

  @Column()
  TIMEOUT?: string;

  @Column()
  OTJOB?: string;

  @Column()
  REMARK?: string;

  @Column()
  FORSECCODE?: string;

  @Column()
  VFILENAME?: string;

  @Column()
  OT3?: string;

  @Column()
  SPECIAL?: string;

  @Column()
  SPECIAL_REASON?: string;
}