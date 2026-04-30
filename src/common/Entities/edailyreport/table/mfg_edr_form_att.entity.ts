import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MfgEdrFormHead } from './mfg_edr_form_head.entity';

@Entity({ name: 'MFG_EDR_FORM_ATT' })
export class MfgEdrFormAtt {
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
  FILENAME: string | null;

  @ManyToOne(() => MfgEdrFormHead, (head) => head.att)
  @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
  head: MfgEdrFormHead;
}