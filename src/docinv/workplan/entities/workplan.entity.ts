import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { IsForm1 } from '../../../webform/isform/is-form1/entities/is-form1.entity';
import { IsForm3 } from '../../../webform/isform/is-form3/entities/is-form3.entity';
import { IsForm4 } from '../../../webform/isform/is-form4/entities/is-form4.entity';
import { Workpic } from '../../../docinv/workpic/entities/workpic.entity';
import { Specification } from '../../../docinv/specification/entities/specification.entity';
import { Release } from '../../../docinv/release/entities/release.entity';

@Entity('WORK_PLAN')
export class Workplan {
  @PrimaryColumn()
  PLANID: number;

  @Column()
  PLANYEAR: string;

  @Column()
  REQ_DIV: string;

  @Column()
  REQ_DEPT: string;

  @Column()
  REQ_NO: string;

  @Column()
  REQ_PIC: string;

  @Column()
  OBJECTIVE: string;

  @Column()
  CATEGORY: string;

  @Column()
  TITLE: string;

  @Column()
  PURPOSE: string;

  @Column()
  PLANCONFIRM: string;

  @Column()
  PROFIT: string;

  @Column()
  DEV_NO: string;

  @Column()
  PLANSTART: string;

  @Column()
  PLANFINISH: string;

  @Column()
  DEV_COST: string;

  @Column()
  DEV_INVESTMENT: string;

  @Column()
  PRJSTS_ID: string;

  @Column()
  STATUS_ID: string;

  @Column()
  REASON: string;

  @Column()
  SYSNAME: string;

  @Column()
  REQ_ID: string;

  @Column()
  OBJOTHER: string;

  @Column()
  RELEASE_DATE: string;

  @Column()
  DEV_TIME: string;

  @Column()
  LATEST_UPDATE: string;

  @Column()
  REF_ID: string;

  @OneToMany(() => Workpic, (pic) => pic.workplan)
  @JoinColumn([{ name: 'PLANID', referencedColumnName: 'PROJECT' }])
  workpic: Workpic[];

  @OneToOne(() => IsForm1, (frm) => frm.workplan)
  @JoinColumn([{ name: 'PLANID', referencedColumnName: 'PLANID' }])
  planfrm: IsForm1;

  @OneToOne(() => IsForm3, (frm) => frm.workplan)
  @JoinColumn([{ name: 'PLANID', referencedColumnName: 'PLAN_ID' }])
  form3: IsForm3;

  @OneToOne(() => IsForm4, (frm) => frm.workplan)
  @JoinColumn([{ name: 'PLANID', referencedColumnName: 'PLANID' }])
  form4: IsForm4;

  @OneToMany(() => Specification, (frm) => frm.workplan)
  @JoinColumn([{ name: 'PLANID', referencedColumnName: 'PLANID' }])
  spec: Specification;

  @OneToMany(() => Release, (frm) => frm.workplan)
  @JoinColumn([{ name: 'PLANID', referencedColumnName: 'PLANID' }])
  release: Release;
}
