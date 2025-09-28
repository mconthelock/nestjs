import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/amec/users/entities/user.entity';

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

  @ManyToOne(() => User, (usr) => usr.loginlogs)
  @JoinColumn([{ name: 'LOG_USER', referencedColumnName: 'SEMPNO' }])
  users: User;
}
