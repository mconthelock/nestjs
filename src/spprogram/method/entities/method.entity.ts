import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('SP_METHOD')
export class Method {
  @PrimaryColumn()
  METHOD_ID: number;

  @Column()
  METHOD_DESC: string;

  @Column()
  METHOD_STATUS: number;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;
}
