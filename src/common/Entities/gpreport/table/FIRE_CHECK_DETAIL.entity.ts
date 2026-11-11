import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'FIRE_CHECK_DETAIL', schema: 'GPREPORT' })
export class FireCheckDetail {
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
  ID: number;

  @PrimaryColumn()
  FIRE_CODE: string;

  @Column()
  GAGE: string | null;

  @Column()
  WEIGHT: number | null;

  @Column()
  PIN: string | null;

  @Column()
  HOSE: string | null;

  @Column()
  CLEAN: string | null;

  @Column()
  DETAIL: string | null;
}
