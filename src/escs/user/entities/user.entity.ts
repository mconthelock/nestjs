import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../../amec/users/entities/user.entity';
@Entity('ESCS_USERS')
export class EscsUser {
  @PrimaryColumn()
  USR_ID: number;

  @Column()
  USR_NO: string;

  @Column()
  USR_NAME: string;

  @Column()
  USR_EMAIL: string;

  @Column({
    type: 'date',
    default: () => 'SYSDATE',
  })
  USR_REGISTDATE: Date;

  @Column()
  USR_USERUPDATE: number;

  @Column({
    type: 'date',
    default: () => 'SYSDATE',
  })
  USR_DATEUPDATE: Date;

  @Column()
  GRP_ID: number;

  @Column({ default: 1 })
  USR_STATUS: number;

  @Column()
  SEC_ID: number;

  @OneToOne(() => User, (user) => user.escsUser)
  @JoinColumn({ name: 'USR_NO', referencedColumnName: 'SEMPNO' })
  user: User;
}
