import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { JobExecutionLog } from './job-log.entity';

@Entity('SCHEDULED_JOBS')
export class ScheduledJob {
  @PrimaryGeneratedColumn('uuid')
  ID: string;

  @Column()
  NAME: string;

  @Column()
  URL: string;

  @Column()
  CRON_EXPRESSION: string;

  @Column()
  DESCRIPTION: string;

  @Column({ default: 1 })
  IS_ACTIVE: number;

  @Column()
  LAST_RUN_AT: Date;

  @Column()
  INCHARGE: string;

  @Column()
  CREATE_BY: string;

  @CreateDateColumn()
  CREATE_AT: Date;

  @Column()
  UPDATE_BY: string;

  @UpdateDateColumn()
  UPDATE_AT: Date;

  @OneToMany(() => JobExecutionLog, (log) => log.job)
  @JoinColumn({ name: 'ID', referencedColumnName: 'JOB_ID' })
  logs: JobExecutionLog[];
}
