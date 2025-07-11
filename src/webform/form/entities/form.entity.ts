import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Flow } from '../../flow/entities/flow.entity';
import { User } from '../../../amec/users/entities/user.entity';
import { Formmst } from '../../formmst/entities/formmst.entity';

//IS Form
import { IsDev } from '../../isform/is-dev/entities/is-dev.entity';
import { IsForm1 } from '../../isform/is-form1/entities/is-form1.entity';
import { IsForm3 } from '../../isform/is-form3/entities/is-form3.entity';
import { IsForm4 } from '../../isform/is-form4/entities/is-form4.entity';
import { IsMo } from '../../isform/is-mo/entities/is-mo.entity';

//GP Form
import { GpOt } from './../../gpform/gp-ot/entities/gp-ot.entity';

@Entity('FORM')
export class Form {
  @PrimaryColumn()
  NFRMNO: number;

  @PrimaryColumn()
  VORGNO: string;

  @PrimaryColumn()
  CYEAR: string;

  @PrimaryColumn()
  CYEAR2: string;

  @PrimaryColumn()
  NRUNNO: number;

  @Column()
  VREQNO: string;

  @Column()
  VINPUTER: string;

  @Column()
  VREMARK: string;

  @Column()
  DREQDATE: Date;

  @Column()
  CREQTIME: string;

  @Column()
  CST: string;

  @Column()
  VFORMPAGE: string;

  @Column()
  VREMOTE: string;

  @OneToOne(() => User, (user) => user.SEMPNO)
  @JoinColumn({ name: 'VINPUTER', referencedColumnName: 'SEMPNO' })
  creator: User;

  @OneToOne(() => Formmst, (mst) => mst.form)
  @JoinColumn([
    { name: 'NFRMNO', referencedColumnName: 'NNO' },
    { name: 'VORGNO', referencedColumnName: 'VORGNO' },
    { name: 'CYEAR', referencedColumnName: 'CYEAR' },
  ])
  formmst: Formmst;

  @OneToMany(() => Flow, (flow) => flow.form)
  @JoinColumn([
    { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
    { name: 'VORGNO', referencedColumnName: 'VORGNO' },
    { name: 'CYEAR', referencedColumnName: 'CYEAR' },
    { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
    { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
  ])
  flow: Flow[];

  //IS Form
  @OneToOne(() => IsDev, (isdev) => isdev.form)
  @JoinColumn([
    { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
    { name: 'VORGNO', referencedColumnName: 'VORGNO' },
    { name: 'CYEAR', referencedColumnName: 'CYEAR' },
    { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
    { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
  ])
  isdev: IsDev;

  @OneToOne(() => IsForm1, (form1) => form1.form)
  @JoinColumn([
    { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
    { name: 'VORGNO', referencedColumnName: 'VORGNO' },
    { name: 'CYEAR', referencedColumnName: 'CYEAR' },
    { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
    { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
  ])
  form1: IsForm1;

  @OneToOne(() => IsForm3, (form3) => form3.form)
  @JoinColumn([
    { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
    { name: 'VORGNO', referencedColumnName: 'VORGNO' },
    { name: 'CYEAR', referencedColumnName: 'CYEAR' },
    { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
    { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
  ])
  form3: IsForm3;

  @OneToOne(() => IsForm4, (form4) => form4.form)
  @JoinColumn([
    { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
    { name: 'VORGNO', referencedColumnName: 'VORGNO' },
    { name: 'CYEAR', referencedColumnName: 'CYEAR' },
    { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
    { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
  ])
  form4: IsForm4;

  @OneToOne(() => IsMo, (formmo) => formmo.form)
  @JoinColumn([
    { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
    { name: 'VORGNO', referencedColumnName: 'VORGNO' },
    { name: 'CYEAR', referencedColumnName: 'CYEAR' },
    { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
    { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
  ])
  formmo: IsMo;

  //GP Form
  @OneToOne(() => GpOt, (formot) => formot.form)
  @JoinColumn([
    { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
    { name: 'VORGNO', referencedColumnName: 'VORGNO' },
    { name: 'CYEAR', referencedColumnName: 'CYEAR' },
    { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
    { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
  ])
  formot: GpOt;
}
