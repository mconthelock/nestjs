import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('QAINS_OPERATOR_AUDITOR')
export class QainsOA {
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
  QOA_SEQ: number;

  @PrimaryColumn()
  QOA_TYPECODE: string;
  
  @Column()
  QOA_EMPNO: string;
}
