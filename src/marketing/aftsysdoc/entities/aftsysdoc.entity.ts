import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('AFT_SYSDOC')
export class Aftsysdoc {
  @PrimaryColumn()
  F001: string;

  @Column()
  F003: string;

  @Column()
  F004: string;

  @Column()
  F008: string;

  @Column()
  F009: string;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;
}
