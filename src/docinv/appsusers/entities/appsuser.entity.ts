import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Appsgroup } from '../../appsgroups/entities/appsgroup.entity';

@Entity('APP_USERS')
export class Appsuser {
  @PrimaryColumn()
  USERS_ID: string;

  @PrimaryColumn()
  PROGRAM: number;

  @Column()
  USERS_GROUP: number;

  @Column()
  USERS_CREATED: Date;

  @Column()
  USERS_STATUS: string;

  @Column()
  USERS_PROFILE: string;

  @Column()
  APP_LASTLOGIN: string;

  @ManyToOne(() => Appsgroup, (group) => group.appsuser)
  @JoinColumn([
    { name: 'USERS_GROUP', referencedColumnName: 'GROUP_ID' },
    { name: 'PROGRAM', referencedColumnName: 'PROGRAM' },
  ])
  appsgroups: Appsgroup[];
}
