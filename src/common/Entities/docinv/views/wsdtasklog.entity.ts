import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('JOB_RESULT_CONFIRMATION')
export class WSDTaskLog {
  @PrimaryColumn()
  LOG_DATE: string;

  @PrimaryColumn()
  JOBNO: string;

  @Column()
  JOBNAME: string;

  @Column()
  JOBPLAN: string;

  @Column()
  JOBSTANDARD: string;

  @Column()
  JOBPIC: string;

  @Column()
  JOBSTART: string;

  @Column()
  JOBEND: string;

  @Column()
  JOBSTATUS: string;

  @Column()
  LOG_DATETIME: string;

  @Column()
  RC_ACTION: string;

  @Column()
  RC_CONCERN: string;

  @Column()
  RC_CHECKER: string;

  @Column()
  RC_CHECKDATE: string;

  @Column()
  RC_CHECKERNAME: string;
}
