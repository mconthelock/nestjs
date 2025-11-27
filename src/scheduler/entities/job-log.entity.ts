import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ScheduledJob } from './scheduled-job.entity';

@Entity('JOB_EXECUTION_LOGS')
export class JobExecutionLog {
  @PrimaryGeneratedColumn('uuid')
  ID: string;

  @Column()
  JOB_ID: string;

  @Column()
  START_TIME: Date;

  @Column()
  END_TIME: Date;

  @Column()
  DURATION_MS: number;

  @Column()
  STATUS: string;

  @Column()
  RESPONSE_CODE: number;

  @Column()
  OUTPUT_MESSAGE: string;

  @ManyToOne(() => ScheduledJob, (job) => job.logs)
  @JoinColumn({ name: 'JOB_ID', referencedColumnName: 'ID' })
  job: ScheduledJob;
}
