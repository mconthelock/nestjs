import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ITGC_SPECIALUSER')
export class Specialuser {
  @PrimaryColumn()
  SERVER_NAME: string;

  @Column()
  USER_DOMAIN: string;

  @PrimaryColumn()
  USER_LOGIN: string;

  @Column()
  USER_OWNER: string;

  @Column()
  DESCRIPT: string;

  @Column()
  AUTH_CLASS: string;

  @Column()
  @PrimaryColumn()
  CATEGORY: string;

  @Column()
  AUTH_OGANIZE: string;

  @Column()
  USER_TYPE1: string;

  @Column()
  USER_TYPE2: string;

  @Column()
  SERVER_TITLE: string;

  @Column()
  USER_STATUS: number;

  @Column()
  USER_EMAIL: string;

  @Column()
  EMPNO: string;

  @Column()
  ROLE: string;

  @Column()
  START_DATE: Date;

  @Column()
  ACTIVE_STATUS: number;

  @Column()
  GROUP_NAME: string;
}
