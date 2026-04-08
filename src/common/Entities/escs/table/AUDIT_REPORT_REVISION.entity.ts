import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { USERS } from './USERS.entity';
import { QAINS_FORM } from '../../webform/table/QAINS_FORM.entity';

@Entity({
  name: 'AUDIT_REPORT_REVISION',
  schema: 'ESCCHKSHT'
})
export class AUDIT_REPORT_REVISION {
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

  @OneToOne(() => USERS, (u) => u.auditRev)
  @JoinColumn({ name: 'ARR_INCHARGE', referencedColumnName: 'USR_ID' })
  ARR_INCHARGE_INFO: USERS | null;

  @OneToOne(() => QAINS_FORM, (q) => q.QA_REV_INFO)
  @JoinColumn({ name: 'ARR_REV', referencedColumnName: 'QA_REV' })
  @JoinColumn({ name: 'ARR_SECID', referencedColumnName: 'QA_INCHARGE_SECTION' })
  QAINSREV: QAINS_FORM | null;
}
