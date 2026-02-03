import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('BUS_STATION')
export class Busstation {
  @PrimaryGeneratedColumn()
  id: number; // หากไม่พบ Primary Key ใน SQL จะใช้ id เป็น PrimaryGeneratedColumn เริ่มต้น

  @Column()
  STATION_ID: number;

  @Column()
  STATION_NAME: string;

  @Column()
  STATION_STATUS: string;

  @Column()
  BUSLINE: number;

  @Column()
  WORKDAY_TIMEIN: string;

  @Column()
  WORKDAY_TIMEDROP: string;

  @Column()
  NIGHT_TIMEIN: string;

  @Column()
  NIGHT_TIMEDROP: string;

  @Column()
  HOLIDAY_TIMEIN: string;

  @Column()
  HOLIDAY_TIMEDROP: string;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;
}
