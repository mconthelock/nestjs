import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('SECRETLOG')
export class Secretlog {
  @PrimaryColumn({ default: () => new Date() })
  LOGDATE: Date;

  @Column()
  LOGUSER: string;

  @Column()
  LOGNAME: string;

  @Column()
  LOGDOC: string;

  @Column()
  LOGDIR: string;

  @Column()
  CREATEBY: string;
}
