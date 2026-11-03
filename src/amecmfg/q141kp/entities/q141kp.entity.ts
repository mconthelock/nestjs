import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Q141KP')
export class Q141kp {
  @PrimaryGeneratedColumn()
  id: number; // หากไม่พบ Primary Key ใน SQL จะใช้ id เป็น PrimaryGeneratedColumn เริ่มต้น

  @Column()
  Q41K01: string;

  @Column()
  Q41K02: string;

  @Column()
  Q41K03: string;

  @Column()
  Q41K04: string;

  @Column()
  Q41K05: string;

  @Column()
  Q41K06: string;

  @Column()
  Q41K07: string;

  @Column()
  Q41K08: string;

  @Column()
  Q41K09: string;

  @Column()
  Q41K10: string;

  @Column()
  Q41K11: string;

  @Column()
  Q41K12: string;

  @Column()
  Q41K13: string;

  @Column()
  Q41K14: string;

  @Column()
  Q41K15: string;

  @Column()
  Q41K16: string;

  @Column()
  Q41K17: string;

  @Column()
  Q41K18: string;

  @Column()
  Q41K19: string;

  @Column()
  Q41K20: string;

  @Column()
  Q41K22: string;

  @Column()
  Q41K23: string;

  @Column()
  Q41K24: string;

  @Column()
  Q41K25: number;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;
}
