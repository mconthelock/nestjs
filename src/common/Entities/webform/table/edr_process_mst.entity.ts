import { Column, Entity, PrimaryColumn, OneToMany, JoinColumn } from 'typeorm';
import { MfgEdrFormList } from './mfg_edr_form_list.entity';

@Entity({ name: 'EDR_PROCESS_MST' })
export class EdrProcessMst {
  @PrimaryColumn()
  PID: number;

  @Column()
  PROCESS: string;

  @OneToMany(() => MfgEdrFormList, (list) => list.process)
  @JoinColumn({ name: 'PID', referencedColumnName: 'PID' })
  list: MfgEdrFormList;

}