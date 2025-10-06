import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SpUser } from 'src/spprogram/spusers/spusers.entity';
import { Status } from 'src/spprogram/status/entities/status.entity';

@Entity('SP_INQUIRY_HISTORY')
export class History {
  @PrimaryColumn()
  INQ_NO: string;

  @PrimaryColumn()
  INQ_REV: string;

  @PrimaryColumn()
  INQH_USER: string;

  @PrimaryColumn()
  INQH_ACTION: number;

  @Column({ default: () => 'sysdate' })
  INQH_DATE: Date;

  @Column({ default: () => 1 })
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
