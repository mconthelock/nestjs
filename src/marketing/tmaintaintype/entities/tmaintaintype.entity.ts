import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('TMAINTAINTYPE')
export class Tmaintaintype {
  @PrimaryColumn()
  ID: number;

  @Column()
  ABBREVIATION: string;

  @Column()
  DETAIL: string;

  @Column()
  EDI_PART_NUMBER: string;

  @Column()
  PC_FORM: string;

  @Column()
  SERIESNAME: string;

  @Column()
  DESCRIPTION_INVOICE: string;

  @Column()
  PREASSY: string;

  @Column()
  CAPAMIN: number;

  @Column()
  CAPAMAX: number;

  @Column()
  SPEDVALUE: string;

  @Column()
  REFERXML: string;

  @Column()
  STATUSACTIVE: string;

  @Column()
  TYPEOFMODEL: string;

  @Column()
  GROUPMAIL: string;

  @Column()
  BYPASSMODEL: number;

  @Column()
  MODERNIZE: number;

  // สามารถเพิ่มความสัมพันธ์ของข้อมูลได้ที่นี่
  // ตัวอย่าง:
  // @ManyToOne(() => User, user => user.posts)
  // user: User;
}
