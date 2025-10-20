import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('MASTERKEY')
export class Masterkey {
  @PrimaryColumn()
  KEY_OWNER: string;

  @Column()
  KEY_CODE: string;

  @Column()
  KEY_ROLE: string;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;
}
