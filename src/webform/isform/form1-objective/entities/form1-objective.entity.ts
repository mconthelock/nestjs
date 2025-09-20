import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('FORM1_OBJECTIVE')
export class Form1Objective {
  @PrimaryGeneratedColumn()
  OBJECTIVE_ID: number; // หากไม่พบ Primary Key ใน SQL จะใช้ id เป็น PrimaryGeneratedColumn เริ่มต้น

  @Column()
  OBJECTIVE_NAME: string;

  @Column()
  CSTATUS: string;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;
}
