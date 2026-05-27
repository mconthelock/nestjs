import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MfgEdrFormHead } from './mfg_edr_form_head.entity';

@Entity({ name: 'MFG_EDR_FORM_CAUSE4M' })
export class MfgEdrFormCause4m {
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
  CAUSE: string;

  @Column()
  DETAIL: string | null;

  @Column()
  DUE_DATE: string | null;

  @Column()
  PIC: string | null;

  @ManyToOne(() => MfgEdrFormHead, (head) => head.corrective)
  @JoinColumn([
    { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
    { name: 'VORGNO', referencedColumnName: 'VORGNO' },
    { name: 'CYEAR', referencedColumnName: 'CYEAR' },
    { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
    { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
  ])
  head: MfgEdrFormHead;
}