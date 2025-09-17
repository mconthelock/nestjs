import { Entity, PrimaryColumn, Column, JoinColumn, OneToMany } from 'typeorm';
import { QaFile } from '../../qa_file/entities/qa_file.entity';
import { QainsOA } from '../../qa-ins/qains_operator_auditor/entities/qains_operator_auditor.entity';

@Entity('QA_TYPE')
export class QaType {
  @PrimaryColumn()
  QAT_CODE: string;

  @Column()
  QAT_TABLE: string;

  @Column()
  QAT_COLUMNCODE: string;

  @Column()
  QAT_NAME: string;

  @Column()
  QAT_DETAIL: string;

  @OneToMany(() => QaFile, (f) => f.TYPE)
  FILE_TYPE: QaFile[];

  @OneToMany(() => QainsOA, (o) => o.TYPE)
  QOA_TYPE: QainsOA[];
}
