import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('APP_USERS_GROUP')
export class Appsgroup {
  @PrimaryColumn()
  GROUP_ID: number;

  @Column()
  GROUP_DESC: string;

  @Column()
  GROUP_STATUS: string;

  @PrimaryColumn()
  PROGRAM: number;

  @Column()
  GROUP_REMARK: string;

  @Column()
  GROUP_CODE: string;

  @Column()
  GROUP_HOME: string;

  @Column()
  UPDATE_DATE: string;
}
