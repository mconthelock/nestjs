import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('QA_TYPE')
export class QaType {
  @PrimaryColumn()
  QAT_CODE: string;

  @PrimaryColumn()
  QAT_NO: number;

  @Column()
  QAT_NAME: string;

  @Column()
  QAT_DETAIL: string;
}
