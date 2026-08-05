import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'MFG_EDR_TARGET_MASTER',
  schema: 'WEBFORM',
})
export class MfgEdrTargetMaster {
  @PrimaryColumn({ type: 'number', precision: 4 })
  FYEAR: number;

  @PrimaryColumn({ type: 'varchar2', length: 6 })
  SSECCODE: string;

  @Column({ type: 'number', nullable: true })
  JAN?: number;

  @Column({ type: 'number', nullable: true })
  FEB?: number;

  @Column({ type: 'number', nullable: true })
  MAR?: number;

  @Column({ type: 'number', nullable: true })
  APR?: number;

  @Column({ type: 'number', nullable: true })
  MAY?: number;

  @Column({ type: 'number', nullable: true })
  JUN?: number;

  @Column({ type: 'number', nullable: true })
  JUL?: number;

  @Column({ type: 'number', nullable: true })
  AUG?: number;

  @Column({ type: 'number', nullable: true })
  SEP?: number;

  @Column({ type: 'number', nullable: true })
  OCT?: number;

  @Column({ type: 'number', nullable: true })
  NOV?: number;

  @Column({ type: 'number', nullable: true })
  DEC?: number;
}