import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('APPLICATION_LOG')
export class Accesslog {
  @PrimaryColumn()
  LOG_ID: number;

  @Column()
  LOG_USER: string;

  @Column()
  LOG_IP: string;

  @Column()
  LOG_DATE: Date;

  @Column()
  LOG_STATUSES: number;

  @Column()
  LOG_PROGRAM: number;

  @Column()
  LOG_MESSAGE: string;
}
