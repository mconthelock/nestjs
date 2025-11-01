import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PROGRAM_REVISION')
export class Revision {
  @PrimaryGeneratedColumn()
  id: number; // หากไม่พบ Primary Key ใน SQL จะใช้ id เป็น PrimaryGeneratedColumn เริ่มต้น

  @Column()
  PROGRAM: number;

  @Column()
  MODULE: number;

  @Column()
  REVISION: number;

  @Column()
  REV_DATE: Date;

  @Column()
  REV_USER: string;

  @Column()
  REV_DESC: string;

  @Column()
  REV_REQUEST: string;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;
}
