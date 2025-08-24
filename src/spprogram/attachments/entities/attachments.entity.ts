import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('SP_ATTACHED')
export class Attachments {
  @PrimaryColumn()
  INQ_NO: string;

  @PrimaryColumn()
  FILE_NAME: string;

  @Column()
  FILE_ID: number;

  @Column()
  FILE_ORIGINAL_NAME: string;

  @Column()
  FILE_SIZE: number;

  @Column()
  FILE_TYPE: string;

  @Column()
  FILE_CLASS: string;

  @Column()
  FILE_STATUS: number;

  @Column()
  FILE_OWNER: string;

  @Column()
  FILE_MAR_READ: number;

  @Column()
  FILE_DES_READ: number;

  @Column()
  FILE_CREATE_AT: Date;

  @Column()
  FILE_CREATE_BY: string;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;
}
