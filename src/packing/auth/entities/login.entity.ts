import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('Ulogin')
export class Login {
  @PrimaryColumn()
  uid: string;

  @Column()
  uname: string;

  @Column()
  usectid?: string;

  @Column()
  ucreatdte?: Date;

  @Column()
  ucreatby?: string;

  @Column()
  mrkdel?: boolean;
}
