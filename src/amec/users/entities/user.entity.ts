import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Form } from '../../../webform/form/entities/form.entity';
import { Workpic } from '../../../docinv/workpic/entities/workpic.entity';
import { SetRequestDate } from 'src/joborder/set-request-date/entities/set-request-date.entity';
import { EscsUser } from 'src/escs/user/entities/user.entity';

@Entity('AMECUSERALL')
export class User {
  @PrimaryColumn()
  SEMPNO: string;

  @Column()
  SNAME: string;

  @Column()
  SRECMAIL: string;

  @Column()
  SSECCODE: string;

  @Column()
  SSEC: string;

  @Column()
  SDEPCODE: string;

  @Column()
  SDEPT: string;

  @Column()
  SDIVCODE: string;

  @Column()
  SDIV: string;

  @Column()
  SPOSCODE: string;

  @Column()
  SPOSNAME: string;

  @Column()
  SPASSWORD1: string;

  @Column()
  CSTATUS: string;

  @Column()
  SEMPENCODE: string;

  @Column()
  MEMEML: string;

  @Column()
  STNAME: string;

  @OneToOne(() => Form, (form) => form.VINPUTER)
  @JoinColumn({ name: 'SEMPNO', referencedColumnName: 'VINPUTER' })
  creator: User;

  @OneToOne(() => Workpic, (dev) => dev.developer)
  @JoinColumn({ name: 'SEMPNO', referencedColumnName: 'PIC_ID' })
  dev: Workpic;

  @OneToMany(() => SetRequestDate, (req) => req.JOP_MAR_REQUEST)
  marRequest: SetRequestDate[];

  @OneToMany(() => SetRequestDate, (req) => req.JOP_PUR_CONFIRM)
  purConfirm: SetRequestDate[];

  @OneToOne(() => EscsUser, (escsUser) => escsUser.user)
  escsUser: EscsUser;
}
