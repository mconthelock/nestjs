import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Workplan } from '../../workplan/entities/workplan.entity';
import { User } from '../../../amec/users/entities/user.entity';

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

  @OneToOne(() => User, (user) => user.dev)
  @JoinColumn([{ name: 'PIC_ID', referencedColumnName: 'SEMPNO' }])
  developer: User;
}
