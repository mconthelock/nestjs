import { Column, Entity, PrimaryColumn } from 'typeorm';

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

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;
}
