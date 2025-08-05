import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SpUser } from 'src/spprogram/users/users.entity';

@Entity('SP_INQUIRY_HISTORY')
export class History {
  @PrimaryColumn()
  INQH_DATE: Date;

  @Column()
  INQ_NO: string;

  @Column()
  INQ_REV: string;

  @Column()
  INQH_USER: string;

  @Column()
  INQH_ACTION: number;

  @Column()
  INQH_LATEST: number;

  @Column()
  INQH_REMARK: string;

  @ManyToOne(() => SpUser, (usr) => usr.history)
  @JoinColumn({ name: 'INQH_USER', referencedColumnName: 'SEMPNO' })
  users: SpUser;
}
