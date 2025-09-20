import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('FORM1_WAGE')
export class Form1Wage {
  @PrimaryColumn()
  FYEAR: number; // หากไม่พบ Primary Key ใน SQL จะใช้ id เป็น PrimaryGeneratedColumn เริ่มต้น

  @Column()
  POSITION: string;

  @Column('decimal', { precision: 10, scale: 2 })
  WAGE: number;

  @Column()
  CSTATUS: string;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;
}
