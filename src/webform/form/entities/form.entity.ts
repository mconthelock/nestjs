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
import { IsDev } from '../../isform/is-dev/entities/is-dev.entity';

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

  @OneToMany(() => Flow, (flow) => flow.form)
  @JoinColumn([
    { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
    { name: 'VORGNO', referencedColumnName: 'VORGNO' },
    { name: 'CYEAR', referencedColumnName: 'CYEAR' },
    { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
    { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
  ])
  flow: Flow[];

  @OneToOne(() => User, (user) => user.SEMPNO)
  @JoinColumn({ name: 'VINPUTER', referencedColumnName: 'SEMPNO' })
  creator: User;

  @OneToOne(() => IsDev, (isdev) => isdev.form)
  @JoinColumn([
    { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
    { name: 'VORGNO', referencedColumnName: 'VORGNO' },
    { name: 'CYEAR', referencedColumnName: 'CYEAR' },
    { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
    { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
  ])
  devform: IsDev;
}
