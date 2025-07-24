import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('VALL_ITEMARRNGLST')
export class Itemarrnglst {
  @PrimaryColumn()
  ORDERNO: string;

  @Column()
  MELCALACLS: string;

  @PrimaryColumn()
  ITEMNO: string;

  @PrimaryColumn()
  SERIALNO: string;

  @Column()
  BMCLS: string;

  @Column()
  APNAMERMRK: string;

  @Column()
  PARTNO: string;

  @Column()
  TOTALQTY: number;

  @Column()
  SCNDPRTCLS: string;

  @Column()
  SUPPLYCLS: string;

  @Column()
  REVSUBNO: string;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;
}
