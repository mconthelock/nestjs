import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('WORK_STATUS')
export class IsWorkStatus {
  @PrimaryColumn()
  STATUS_ID: number;

  @Column()
  STATUS_ACTION: string;

  @Column()
  STATUS_DESC: string;

  @PrimaryColumn()
  STATUS_CLASS: string;
}
