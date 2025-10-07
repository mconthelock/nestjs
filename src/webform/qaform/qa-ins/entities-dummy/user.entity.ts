import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { QainsOA } from '../qains_operator_auditor/entities/qains_operator_auditor.entity';
import { QainsForm } from '../qains_form/entities/qains_form.entity';

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
  CSTATUS: string;

  @Column()
  MEMEML: string;

  @Column()
  SEMPPRT: string;

  @Column()
  STNAME: string;

  @Column()
  STARTDATE: Date;

  @OneToOne(() => QainsOA, (q) => q.QOA_EMPNO)
  QAINSOA: QainsOA;

  @OneToOne(() => QainsForm, (q) => q.QA_INCHARGE_INFO)
  INCHARGE: QainsForm;
}
