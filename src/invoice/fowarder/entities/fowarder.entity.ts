import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('TSPI_FOWARDER')
export class Fowarder {
  @PrimaryGeneratedColumn()
  FOWARDER_CODE: number;

  @Column()
  FOWARDER_DETAIL: string;

  @Column()
  SHPNO: number;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;
}
