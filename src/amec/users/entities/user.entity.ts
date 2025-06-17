import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('AMECUSERALL')
export class User {
  @PrimaryColumn()
  SEMPNO: string;

  @Column()
  SNAME: string;

  @Column()
  SRECMAIL: string;

  @Column()
  SSECCODE: string;

  @Column()
  SSEC: string;

  @Column()
  SDEPCODE: string;

  @Column()
  SDEPT: string;

  @Column()
  SDIVCODE: string;

  @Column()
  SDIV: string;

  @Column()
  SPOSCODE: string;

  @Column()
  SPOSNAME: string;

  @Column()
  SPASSWORD1: string;

  @Column()
  CSTATUS: string;

  @Column()
  SEMPENCODE: string;

  @Column()
  MEMEML: string;

  @Column()
  STNAME: string;
}
