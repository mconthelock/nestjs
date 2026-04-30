import { Column, Entity, PrimaryColumn, OneToMany, JoinColumn } from 'typeorm';
import { MfgEdrFormHead } from './mfg_edr_form_head.entity';

@Entity({ name: 'EDR_CAUSE_MST' })
export class EdrCauseMst {
  @PrimaryColumn()
  CID: number;

  @Column()
  CAUSE: string;

  @Column()
  CAUSENAME: string;

  @Column()
  CAUSE_GROUP: string | null;

  @Column()
  FOR_QA: string | null;

  @Column()
  FOR_MFG: string | null;

  @OneToMany(() => MfgEdrFormHead, (head) => head.cause)
  @JoinColumn({ name: 'CID', referencedColumnName: 'CID' })
  head: MfgEdrFormHead;
}