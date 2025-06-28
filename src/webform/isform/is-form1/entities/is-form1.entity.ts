import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Workplan } from '../../../../docinv/workplan/entities/workplan.entity';
import { Form } from 'src/webform/form/entities/form.entity';

@Entity('WORK_PLAN_FRM')
export class IsForm1 {
  @PrimaryColumn()
  NFRMNO: string;

  @PrimaryColumn()
  VORGNO: string;

  @PrimaryColumn()
  CYEAR: string;

  @PrimaryColumn()
  CYEAR2: string;

  @PrimaryColumn()
  NRUNNO: string;

  @Column()
  PLANID: string;

  @Column()
  EFFP: string;

  @OneToOne(() => Form, (form) => form.form1)
  @JoinColumn([
    { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
    { name: 'VORGNO', referencedColumnName: 'VORGNO' },
    { name: 'CYEAR', referencedColumnName: 'CYEAR' },
    { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
    { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
  ])
  form: Form;

  @OneToOne(() => Workplan, (plan) => plan.planfrm)
  @JoinColumn([{ name: 'PLANID', referencedColumnName: 'PLANID' }])
  workplan: Workplan;
}
