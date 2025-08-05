import { Column, Entity, PrimaryColumn, OneToMany, JoinColumn } from 'typeorm';
import { Inquiry } from '../../inquiry/entities/inquiry.entity';
import { History } from '../../history/entities/history.entity';

@Entity('SP_STATUS')
export class Status {
  @PrimaryColumn()
  STATUS_ID: number;

  @Column()
  STATUS_ACTION: string;

  @Column()
  STATUS_DESC: string;

  @Column()
  STATUS_TYPE: number;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;

  @OneToMany(() => Inquiry, (inq) => inq.status)
  @JoinColumn({ name: 'STATUS_ID', referencedColumnName: 'INQ_STATUS' })
  inqs: Inquiry;

  @OneToMany(() => History, (st) => st.status)
  @JoinColumn({ name: 'STATUS_ID', referencedColumnName: 'INQH_ACTION' })
  action: History;
}
