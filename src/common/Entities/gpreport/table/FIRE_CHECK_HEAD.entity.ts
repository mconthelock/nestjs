import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity({ name: 'FIRE_CHECK_HEAD', schema: 'GPREPORT' })
@Unique('UK_FIRE_CHECK_AREA_MONTH', ['AREA', 'FMONTH', 'FYEAR'])
export class FireCheckHead {
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

  @Column({ type: 'varchar2', length: 100 })
  AREA: string;

  @Column({ type: 'varchar2', length: 2 })
  FMONTH: string;

  @Column({ type: 'varchar2', length: 4 })
  FYEAR: string;
}
