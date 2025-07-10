import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Workplan } from '../../workplan/entities/workplan.entity';

@Entity('PROG_SPEC')
export class Specification {
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
  DIVCODE: string;

  @Column()
  PROTID: string;

  @Column()
  PROMID: string;

  @Column()
  FUNCCODE: string;

  @Column()
  FUNCREV: string;

  @Column()
  REASON: string;

  @Column()
  SPEC_FILE: string;

  @Column()
  DATADIC_FILE: string;

  @Column()
  PLAN_ID: number;

  @Column()
  PLAN_NO: string;

  @Column({ name: 'PLAN_ID' })
  PLANID: number;

  @ManyToOne(() => Workplan, (plan) => plan.spec)
  @JoinColumn([{ name: 'PLAN_ID', referencedColumnName: 'PLANID' }])
  workplan: Workplan;
}
