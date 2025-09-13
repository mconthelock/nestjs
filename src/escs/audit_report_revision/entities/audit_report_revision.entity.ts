import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { EscsUser } from 'src/escs/user/entities/user.entity';

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
}
