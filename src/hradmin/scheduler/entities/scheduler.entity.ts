import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('TASKSCHEDULER')
export class Scheduler {
  @PrimaryGeneratedColumn()
  TASKID: number;

  @Column()
  TASKNAME: string;

  @Column()
  PLANDATE: Date;

  @Column()
  STARTDATE: Date;

  @Column()
  FINISHDATE: Date;

  @Column()
  STATUS: number;

  @Column()
  CREATEAT: Date;

  @Column()
  CREATEBY: string;

  @Column()
  UPDATEAT: Date;

  @Column()
  UPDATEBY: string;
}
