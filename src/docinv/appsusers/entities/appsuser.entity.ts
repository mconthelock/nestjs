import { Entity, PrimaryColumn, Column } from 'typeorm';

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
}
