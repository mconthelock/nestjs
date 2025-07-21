import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('AGENT_COUNTRY')
export class Agent {
  @PrimaryGeneratedColumn()
  id: number; // หากไม่พบ Primary Key ใน SQL จะใช้ id เป็น PrimaryGeneratedColumn เริ่มต้น

  @Column()
  CTCODE: string;

  @Column()
  AGENT: string;

  @Column()
  STATUS: string;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;
}
