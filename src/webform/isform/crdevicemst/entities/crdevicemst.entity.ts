import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('CR_DEVICEMST')
export class Crdevicemst {
  @PrimaryColumn()
  DNO: number;

  @Column()
  DEVICE: string;

  @Column()
  STATUS: string;

  @Column()
  DEPRECIATION: string;

  @Column()
  TYPE_BRINGOUT: string;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;
}
