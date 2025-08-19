import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { QainsForm } from '../../qains_form/entities/qains_form.entity';
import { QaType } from 'src/webform/qaform/qa_type/entities/qa_type.entity';
import { User } from '../../entities-dummy/user.entity';

@Entity('QAINS_OPERATOR_AUDITOR')
export class QainsOA {
  @PrimaryColumn()
  NFRMNO: number;

  @PrimaryColumn()
  VORGNO: string;

  @PrimaryColumn()
  CYEAR: string;

  @PrimaryColumn()
  CYEAR2: string;

  @PrimaryColumn()
  NRUNNO: number;

  @PrimaryColumn()
  QOA_SEQ: number;

  @PrimaryColumn()
  QOA_TYPECODE: string;

  @Column()
  QOA_EMPNO: string;

  @ManyToOne(() => QainsForm, (form) => form.QA_AUD_OPT)
  @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
  @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
  @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
  @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
  @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
  QAINSFORM: QainsForm | null;

  @ManyToOne(() => QaType, (t) => t.QOA_TYPE)
  @JoinColumn({ name: 'QOA_TYPECODE', referencedColumnName: 'QAT_CODE' })
  TYPE: QaType | null;

  @OneToOne(() => User, (user) => user.QAINSOA)
  @JoinColumn({ name: 'QOA_EMPNO', referencedColumnName: 'SEMPNO' })
  QOA_EMPNO_INFO: User | null;
}
