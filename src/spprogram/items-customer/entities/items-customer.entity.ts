import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('DS_CUSTOMER_ITEM')
export class ItemsCustomer {
  @PrimaryGeneratedColumn()
  id: number; // หากไม่พบ Primary Key ใน SQL จะใช้ id เป็น PrimaryGeneratedColumn เริ่มต้น

  @Column()
  CUSTOMER_ID: number;

  @Column()
  ITEMS_ID: number;

  @Column()
  CREATE_BY: string;

  @Column()
  UPDATE_BY: string;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;
}
