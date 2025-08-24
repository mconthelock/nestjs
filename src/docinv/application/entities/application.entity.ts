import { Entity, PrimaryColumn, Column, OneToMany, JoinColumn } from 'typeorm';
import { Appsuser } from '../../appsusers/entities/appsuser.entity';

@Entity('APPLICATION')
export class Application {
  @PrimaryColumn()
  APP_ID: number;

  @Column()
  APP_NAME: string;

  @Column()
  APP_LOCATION: string;

  @Column()
  APP_PIC1: string;

  @Column()
  APP_PIC2: string;

  @Column()
  APP_ITGC: string;

  @Column()
  APP_CODE: string;

  @Column()
  APP_DESCRIPTION: string;

  @Column()
  APP_STATUS: string;

  @Column()
  APP_UPDATE: string;

  @Column()
  APP_UPDATEBY: string;

  @Column()
  APP_REVISION: string;

  @Column()
  APP_SERVER: string;

  @Column()
  APP_TYPE: string;

  @Column()
  APP_RLS1: string;

  @Column()
  APP_RLS2: string;

  @Column()
  APP_DIV: string;

  @Column()
  APP_NO: string;

  @Column()
  APP_LOGIN: string;

  @Column()
  APP_COLOR: string;

  @Column()
  APP_ICON: string;

  @Column()
  APP_LABEL: string;

  @Column()
  APP_POSTER: string;

  @Column({ name: 'APP_ID' })
  PROGRAM: number;

  @OneToMany(() => Appsuser, (user) => user.application)
  //@JoinColumn([{ name: 'APP_ID', referencedColumnName: 'PROGRAM' }])
  appsuser: Appsuser[];
}
