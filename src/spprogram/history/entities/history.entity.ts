import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SpUser } from 'src/spprogram/spusers/spusers.entity';
import { Status } from 'src/spprogram/status/entities/status.entity';

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

  @ManyToOne(() => SpUser, (user) => user.sphistory)
  @JoinColumn({ name: 'INQH_USER', referencedColumnName: 'SEMPNO' })
  users: SpUser;

  @ManyToOne(() => Status, (st) => st.action)
  @JoinColumn({ name: 'INQH_ACTION', referencedColumnName: 'STATUS_ID' })
  status: Status;
}
