import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { QainsOA } from '../../qains_operator_auditor/entities/qains_operator_auditor.entity';

@Entity('QAINS_AUDIT')
export class QainsAudit {
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
  QAA_TYPECODE: string;

  @PrimaryColumn()
  QAA_AUDIT_SEQ: number;

  @Column()
  QAA_TOPIC: number;

  @Column()
  QAA_SEQ: number;

  @Column()
  QAA_AUDIT: number;

  @Column()
  QAA_COMMENT: string;

  @ManyToOne(() => QainsOA, (form) => form.QA_AUDIT)
  @JoinColumn([
    { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
    { name: 'VORGNO', referencedColumnName: 'VORGNO' },
    { name: 'CYEAR', referencedColumnName: 'CYEAR' },
    { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
    { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
    { name: 'QAA_TYPECODE', referencedColumnName: 'QOA_TYPECODE' },
    { name: 'QAA_AUDIT_SEQ', referencedColumnName: 'QOA_SEQ' },
  ])
  form: QainsOA;
}
