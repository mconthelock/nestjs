import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('CUSTOMER')
export class Customer {
  @PrimaryColumn()
  CUS_ID: number;

  @Column()
  CUS_NAME: string;

  @Column()
  CUS_DISPLAY: string;

  @Column()
  CUS_AGENT: string;

  @Column()
  CUS_COUNTRY: string;

  @Column()
  CUS_CURENCY: string;

  @Column()
  CUS_TERM: string;

  @Column()
  CUS_PROJECT_PREFIX: string;

  @Column()
  CUS_ADDRESS: string;

  @Column()
  CUS_CONTACT: string;

  @Column()
  CUS_EMAIL: string;

  @Column()
  CUS_QUOTATION: number;

  @Column()
  CUS_LT: number;

  @Column()
  CUS_ADJUST: number;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;
}
