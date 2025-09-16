import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { EscsUser } from 'src/escs/user/entities/user.entity';
import { QainsForm } from 'src/webform/qaform/qa-ins/qains_form/entities/qains_form.entity';

@Entity('AUDIT_REPORT_REVISION')
export class AuditReportRevision {
  @PrimaryColumn()
  ARR_SECID: number;
  
  @PrimaryColumn()
  ARR_REV: number;

  @Column()
  ARR_REV_TEXT: string;

  @Column()
  ARR_CREATEDATE: Date;

  @Column()
  ARR_INCHARGE: number;

  @Column()
  ARR_REASON: string;

  @Column()
  ARR_TOTAL: number;

  @OneToOne(() => EscsUser, (u) => u.auditRev)
  @JoinColumn({ name: 'ARR_INCHARGE', referencedColumnName: 'USR_ID' })
  ARR_INCHARGE_INFO: EscsUser | null;

  @OneToOne(() => QainsForm, (q) => q.QA_REV_INFO)
  @JoinColumn({ name: 'ARR_REV', referencedColumnName: 'QA_REV' })
  @JoinColumn({ name: 'ARR_SECID', referencedColumnName: 'QA_INCHARGE_SECTION' })
  QAINSREV: QainsForm | null;
}
