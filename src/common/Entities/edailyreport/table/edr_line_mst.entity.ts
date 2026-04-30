import { Column, Entity, PrimaryColumn, OneToMany, JoinColumn } from 'typeorm';
import { MfgEdrFormList } from './mfg_edr_form_list.entity';

@Entity({ name: 'EDR_LINE_MST' })
export class EdrLineMst {
  @PrimaryColumn()
  LID: number;

  @Column()
  LINE: string;

  @OneToMany(() => MfgEdrFormList, (list) => list.line)
  @JoinColumn({ name: 'LID', referencedColumnName: 'LID' })
  list: MfgEdrFormList;

}