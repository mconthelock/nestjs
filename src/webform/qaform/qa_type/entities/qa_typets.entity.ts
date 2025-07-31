import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('QA_TYPETS')
export class QaTypets {
  @PrimaryColumn()
  QAT_CODE: string;

  @PrimaryColumn()
  QAT_NO: number;

  @Column()
  QAT_NAME: string;

  @Column()
  QAT_DETAIL: string;
}
