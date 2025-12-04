import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Form } from '../../../webform/form/entities/form.entity';
import { Appsuser } from '../../../docinv/appsusers/entities/appsuser.entity';
import { Workpic } from '../../../docinv/workpic/entities/workpic.entity';
import { SetRequestDate } from 'src/joborder/set-request-date/entities/set-request-date.entity';
import { JopMarReq } from 'src/joborder/jop-mar-req/entities/jop-mar-req.entity';
import { JopPurConf } from 'src/joborder/jop-pur-conf/entities/jop-pur-conf.entity';
import { EscsUser } from 'src/escs/user/entities/user.entity';
import { Orgpos } from 'src/webform/orgpos/entities/orgpos.entity';
import { Accesslog } from 'src/docinv/accesslog/entities/accesslog.entity';
import { Designer } from 'src/spprogram/designer/entities/designer.entity';

@Entity('AMECUSERALL')
export class User {
  @PrimaryColumn()
  SEMPNO: string;

  @Column()
  SEMPPRE: string;

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
  SPOSITION: string;

  @Column()
  SPASSWORD1: string;

  @Column()
  CSTATUS: string;

  @Column()
  SEMPENCODE: string;

  @Column()
  MEMEML: string;

  @Column()
  SEMPPRT: string;

  @Column()
  STNAME: string;

  @Column()
  STARTDATE: Date;

  @Column()
  NTELNO: number;

  @Column()
  BIRTHDAY: Number;

  @OneToOne(() => Form, (form) => form.VINPUTER)
  @JoinColumn({ name: 'SEMPNO', referencedColumnName: 'VINPUTER' })
  creator: User;

  //Docinv
  @OneToOne(() => Workpic, (dev) => dev.developer)
  @JoinColumn({ name: 'SEMPNO', referencedColumnName: 'PIC_ID' })
  dev: Workpic;

  @OneToOne(() => Appsuser, (emp) => emp.employee)
  @JoinColumn({ name: 'SEMPNO', referencedColumnName: 'USERS_ID' })
  appemp: Workpic;

  //Joborder
  @OneToMany(() => SetRequestDate, (req) => req.JOP_MAR_REQUEST)
  marRequest: SetRequestDate[];

  @OneToMany(() => SetRequestDate, (req) => req.JOP_PUR_CONFIRM)
  purConfirm: SetRequestDate[];

  @OneToMany(() => JopMarReq, (req) => req.marRequest)
  jopMarReq: JopMarReq[];

  @OneToMany(() => JopPurConf, (req) => req.purConfirm)
  jopPurConf: JopPurConf[];

  @OneToOne(() => EscsUser, (escsUser) => escsUser.user)
  escsUser: EscsUser;

  @OneToOne(() => Orgpos, (o) => o.EMPINFO)
  @JoinColumn({ name: 'SEMPNO', referencedColumnName: 'VEMPNO' })
  orgpos: Orgpos;

  @OneToMany(() => Accesslog, (log) => log.users)
  @JoinColumn([{ name: 'SEMPNO', referencedColumnName: 'LOG_USER' }])
  loginlogs: Accesslog[];

  @OneToOne(() => Designer, (des) => des.user)
  @JoinColumn({ name: 'SEMPNO', referencedColumnName: 'DES_USER' })
  spdesigner: Designer;
}
