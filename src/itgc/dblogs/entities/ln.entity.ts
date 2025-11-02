import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('DB_LOG_VIEW')
export class LnLog {
  @PrimaryColumn()
  LOG_DATE: Date;

  @PrimaryColumn()
  LOG_TIME: string;

  @PrimaryColumn()
  LOG_SERVER: string;

  @Column()
  LOG_USER: string;

  @Column()
  LOG_DOMAIN: string;

  @Column()
  LOG_HOST: string;

  @Column()
  LOG_IP: string;

  @Column()
  LOG_MSG: string;
}
