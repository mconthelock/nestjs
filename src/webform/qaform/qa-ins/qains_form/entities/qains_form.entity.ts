import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { QainsOA } from '../../qains_operator_auditor/entities/qains_operator_auditor.entity';
import { QaFile } from '../../../qa_file/entities/qa_file.entity';
import { User } from '../../entities-dummy/user.entity';
import { UserSection } from '../../entities-dummy/user_section.entity';
import { AuditReportRevision } from 'src/escs/audit_report_revision/entities/audit_report_revision.entity';
import { AuditReportMasterAll } from 'src/escs/audit_report_master_all/entities/audit_report_master_all.entity';
import { ESCSItemStation } from '../../entities-dummy/item-station.entity';

@Entity('QAINS_FORM')
export class QainsForm {
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

  @Column()
  QA_ITEM: string;

  @Column()
  QA_REV: number;

  @Column()
  QA_INCHARGE_SECTION: number;

  @Column()
  QA_INCHARGE_EMPNO: string;

  @Column()
  QA_TRAINING_DATE: Date;

  @Column()
  QA_OJT_DATE: Date;

  @OneToMany(() => QainsOA, (qainsOA) => qainsOA.QAINSFORM)
  QA_AUD_OPT: QainsOA[];

  @OneToMany(() => QaFile, (qaFile) => qaFile.QAINSFORM)
  QA_FILES: QaFile[];

  @OneToOne(() => User, (u) => u.INCHARGE)
  @JoinColumn({ name: 'QA_INCHARGE_EMPNO', referencedColumnName: 'SEMPNO' })
  QA_INCHARGE_INFO: User | null;

  @OneToOne(() => UserSection, (u) => u.QAINS)
  @JoinColumn({ name: 'QA_INCHARGE_SECTION', referencedColumnName: 'SEC_ID' })
  QA_INCHARGE_SECTION_INFO: UserSection | null;

  @OneToOne(() => AuditReportRevision, (q) => q.QAINSREV)
  @JoinColumn({ name: 'QA_REV', referencedColumnName: 'ARR_REV' })
  @JoinColumn({ name: 'QA_INCHARGE_SECTION', referencedColumnName: 'ARR_SECID' })
  QA_REV_INFO: AuditReportRevision | null;

  @OneToMany(() => AuditReportMasterAll, (a) => a.QAINS_FORM)
  QA_MASTER: AuditReportMasterAll[] | null;

  @OneToMany(() => ESCSItemStation, (i) => i.QAINSFORM)
  ITEM_STATION: ESCSItemStation[] | null;
}
