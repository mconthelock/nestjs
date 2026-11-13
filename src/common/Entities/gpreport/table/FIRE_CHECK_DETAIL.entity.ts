import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'FIRE_CHECK_DETAIL', schema: 'GPREPORT' })
export class FireCheckDetail {
  @PrimaryColumn({ type: 'number', precision: 3, scale: 0 })
  NFRMNO: number;

  @PrimaryColumn({ type: 'varchar2', length: 6 })
  VORGNO: string;

  @PrimaryColumn({ type: 'char', length: 2 })
  CYEAR: string;

  @PrimaryColumn({ type: 'char', length: 4 })
  CYEAR2: string;

  @PrimaryColumn({ type: 'number', precision: 6, scale: 0 })
  NRUNNO: number;

  @PrimaryColumn({ type: 'number', precision: 3, scale: 0 })
  ID: number;

  @PrimaryColumn({ type: 'varchar2', length: 20 })
  FIRE_CODE: string;

  @Column({ type: 'varchar2', length: 20, nullable: true })
  GAGE: string | null;

  @Column({ type: 'number', precision: 6, scale: 2, nullable: true })
  WEIGHT: number | null;

  @Column({ type: 'varchar2', length: 20, nullable: true })
  PIN: string | null;

  @Column({ type: 'varchar2', length: 20, nullable: true })
  HOSE: string | null;

  @Column({ type: 'varchar2', length: 20, nullable: true })
  CLEAN: string | null;

  @Column({ type: 'varchar2', length: 500, nullable: true })
  DETAIL: string | null;

  @Column({ type: 'date', nullable: true })
  CHECK_DATE: Date | null;
}
