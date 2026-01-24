import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('MS_PARTS_CATEGORY')
export class Partcategory {
  @PrimaryColumn()
  PCATE_CODE: string;

  @Column()
  PCATE_NAME: string;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;
}
