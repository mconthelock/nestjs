import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Appsuser } from '../../appsusers/entities/appsuser.entity';

@Entity('APP_USERS_GROUP')
export class Appsgroup {
  @PrimaryColumn()
  GROUP_ID: number;

  @Column()
  GROUP_DESC: string;

  @Column()
  GROUP_STATUS: number;

  @PrimaryColumn()
  PROGRAM: number;

  @Column()
  GROUP_REMARK: string;

  @Column()
  GROUP_CODE: string;

  @Column()
  GROUP_HOME: string;

  @Column()
  UPDATE_DATE: Date;

  @OneToMany(() => Appsuser, (user) => user.appsgroups)
  @JoinColumn([
    { name: 'GROUP_ID', referencedColumnName: 'USERS_GROUP' },
    { name: 'PROGRAM', referencedColumnName: 'PROGRAM' },
  ])
  appsuser: Appsuser[];
}
