import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { QainsForm } from '../../qains_form/entities/qains_form.entity';
import { QaType } from 'src/webform/qaform/qa_type/entities/qa_type.entity';
import { User } from '../../entities-dummy/user.entity';
import { QainsAudit } from '../../qains_audit/entities/qains_audit.entity';
import { QaFile } from 'src/webform/qaform/qa_file/entities/qa_file.entity';

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

  @Column()
  QOA_AUDIT: number;

  @Column()
  QOA_RESULT: number;

  @Column('decimal', {
    // สำหรับ Oracle
    precision: 5, // เช่น 999.99 = 5 หลัก
    scale: 2, // เก็บทศนิยม 2 ตำแหน่ง
  })
  QOA_PERCENT: number;

  @Column()
  QOA_SCORE: number;

  @Column()
  QOA_GRADE: string;

  @Column()
  QOA_AUDIT_RESULT: string;

  @Column()
  QOA_IMPROVMENT_ACTIVITY: string;

  @Column()
  QOA_STATION: string;

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

  @OneToMany(() => QainsAudit, (audit) => audit.form)
  QA_AUDIT: QainsAudit[];

  @OneToMany(() => QaFile, (file) => file.QAINSOA)
  QA_FILES: QaFile[];
}
