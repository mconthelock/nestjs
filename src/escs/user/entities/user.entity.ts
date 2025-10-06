import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../../amec/users/entities/user.entity';
import { AuditReportRevision } from 'src/escs/audit_report_revision/entities/audit_report_revision.entity';
@Entity('ESCS_USERS')
export class EscsUser {
  @PrimaryColumn()
  USR_ID: number;

  @Column()
  USR_NO: string;

  @Column()
  USR_NAME: string;

  @Column()
  USR_EMAIL: string;

  @Column({ type: 'date', insert: false, update: false })
  USR_REGISTDATE: Date;

  @Column()
  USR_USERUPDATE: number;

  @Column({ type: 'date', insert: false, update: false })
  USR_DATEUPDATE: Date;

  @Column()
  GRP_ID: number;

  @Column({ type: 'number', insert: false, update: false })
  USR_STATUS: number;

  @Column()
  SEC_ID: number;

  @OneToOne(() => User, (user) => user.escsUser)
  @JoinColumn({ name: 'USR_NO', referencedColumnName: 'SEMPNO' })
  user: User;

  @OneToOne(() => AuditReportRevision, (user) => user.ARR_INCHARGE_INFO)
  auditRev: AuditReportRevision;
}
