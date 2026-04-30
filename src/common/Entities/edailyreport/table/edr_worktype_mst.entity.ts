import { Column, Entity, PrimaryColumn, OneToMany, JoinColumn } from 'typeorm';
import { MfgEdrFormHead } from './mfg_edr_form_head.entity';

@Entity({ name: 'EDR_WORKTYPE_MST' })
export class EdrWorktypeMst {
  @PrimaryColumn()
  TID: number;

  @Column()
  TYPENAME: string;

  @Column()
  FOR_QA: string;

  @Column()
  FOR_MFG: string;

  @OneToMany(() => MfgEdrFormHead, (head) => head.worktype)
  @JoinColumn({ name: 'TID', referencedColumnName: 'TID' })
  head: MfgEdrFormHead;
}