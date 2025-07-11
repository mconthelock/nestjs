import {
  Entity,
  Column,
  PrimaryColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Workplan } from '../../../../docinv/workplan/entities/workplan.entity';
import { Form } from 'src/webform/form/entities/form.entity';
import { Flow } from 'src/webform/flow/entities/flow.entity';

@Entity('FORM3')
export class IsForm3 {
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
  OPRFILE: string;

  @Column()
  SPECFILE: string;

  @Column()
  PLAN_ID: number;

  @Column({ name: 'PLAN_ID' })
  PLANID: number;

  @OneToOne(() => Form, (form) => form.form1)
  @JoinColumn([
    { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
    { name: 'VORGNO', referencedColumnName: 'VORGNO' },
    { name: 'CYEAR', referencedColumnName: 'CYEAR' },
    { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
    { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
  ])
  form: Form;

  @OneToMany(() => Flow, (flow) => flow.form)
  @JoinColumn([
    { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
    { name: 'VORGNO', referencedColumnName: 'VORGNO' },
    { name: 'CYEAR', referencedColumnName: 'CYEAR' },
    { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
    { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
  ])
  flow: Flow[];

  @OneToOne(() => Workplan, (plan) => plan.form3)
  @JoinColumn([{ name: 'PLAN_ID', referencedColumnName: 'PLANID' }])
  workplan: Workplan;
}
