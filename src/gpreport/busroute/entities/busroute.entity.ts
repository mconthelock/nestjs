import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('BUS_ROUTE')
export class Busroute {
  @PrimaryColumn()
  BUSID: number;

  @Column()
  BUSNAME: string;

  @Column()
  BUSTYPE: string;

  @Column()
  BUSTATUS: string;

  @Column()
  IS_CHONBURI: string;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;
}
