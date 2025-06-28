import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Workplan } from '../../workplan/entities/workplan.entity';

@Entity('WORK_PIC')
export class Workpic {
  @PrimaryColumn()
  PIC_ID: string;

  @Column()
  PIC_WEIGHT: number;

  @Column()
  PLANS_TIME: number;

  @PrimaryColumn()
  PROJECT: number;

  @Column()
  PLAN_EFF: number;

  @PrimaryColumn()
  PLAN_NO: number;

  @Column()
  JOB_TITLE: string;

  @Column()
  REAL_WEIGHT: number;

  @Column()
  PROGRESS: string;

  @ManyToOne(() => Workplan, (plan) => plan.workpic)
  @JoinColumn([{ name: 'PROJECT', referencedColumnName: 'PLANID' }])
  workplan: Workplan;
}
