import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PILINE_BENDING_MAIN', schema: 'WORKLOAD' })
export class piline_bending_main {
  @PrimaryColumn()
  IDTAG: string;

  @Column({ name: 'TYPE', nullable: true })
  TYPE: string;

  @Column({ nullable: true })
  SHEET_COLOR: string;

  @Column({ nullable: true })
  ITEM: string;

  @Column({ nullable: true })
  AT: number;

  @Column({ nullable: true })
  BT: number;

  @Column({ nullable: true })
  AM: number;

  @Column({ nullable: true })
  BM: number;

  @Column({ nullable: true })
  AL: number;

  @Column({ nullable: true })
  BL: number;

  @Column({ nullable: true })
  TA1: number;

  @Column({ nullable: true })
  TA2: number;

  @Column({ nullable: true })
  TA3: number;

  @Column({ nullable: true })
  TA4: number;

  @Column({ nullable: true })
  TB1: number;

  @Column({ nullable: true })
  TB2: number;

  @Column({ nullable: true })
  TB3: number;

  @Column({ nullable: true })
  TB4: number;

  @Column({ nullable: true })
  RECORD_DATE: Date;

  @Column({ nullable: true })
  RECORD_BY: string;
}