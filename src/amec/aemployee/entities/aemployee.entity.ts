import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('AEMPLOYEE')
export class AEmployee {
  @PrimaryColumn({ name: 'SEMPLNO', type: 'varchar', length: 12 })
  semplno: string;

  @Column({ name: 'SDIVCODE', type: 'varchar', length: 6, nullable: true })
  sdivcode: string;

  @Column({ name: 'SDEPCODE', type: 'varchar', length: 6, nullable: true })
  sdepcode: string;

  @Column({ name: 'SSECCODE', type: 'varchar', length: 6, nullable: true })
  sseccode: string;

  @Column({ name: 'SPOSCODE', type: 'varchar', length: 3, nullable: true })
  sposcode: string;

  @Column({ name: 'SNAME', type: 'varchar', length: 120, nullable: true })
  sname: string;

  @Column({ name: 'SSURNAME', type: 'varchar', length: 45, nullable: true })
  ssurname: string;

  @Column({ name: 'STNAME', type: 'varchar', length: 120, nullable: true })
  stname: string;

  @Column({ name: 'STSURNAME', type: 'varchar', length: 45, nullable: true })
  stsurname: string;

  @Column({ name: 'SLOGIN', type: 'varchar', length: 12, nullable: true })
  slogin: string;

  @Column({ name: 'SPASSWORD', type: 'varchar', length: 30, nullable: true })
  spassword: string;

  @Column({ name: 'CSTATUS', type: 'char', length: 1, nullable: true })
  cstatus: string;

  @Column({ name: 'CRECMAIL', type: 'char', length: 1, nullable: true })
  crecmail: string;

  @Column({ name: 'SRECMAIL', type: 'varchar', length: 60, nullable: true })
  srecmail: string;

  @Column({ name: 'STARTDATE', type: 'date', nullable: true })
  startdate: Date;

  @Column({ name: 'CLEVEL', type: 'char', length: 2, nullable: true })
  clevel: string;

  @Column({
    name: 'NTELNO',
    type: 'numeric',
    precision: 5,
    scale: 0,
    nullable: true,
  })
  ntelno: number;

  @Column({
    name: 'NISMSTATUS',
    type: 'numeric',
    precision: 2,
    scale: 0,
    nullable: true,
  })
  nismstatus: number;

  @Column({ name: 'DUPDATE', type: 'date', nullable: true })
  dupdate: Date;

  @Column({ name: 'SPASSWORD1', type: 'varchar', length: 50, nullable: true })
  spassword1: string;

  @Column({ name: 'SPASSWORD2', type: 'varchar', length: 50, nullable: true })
  spassword2: string;

  @Column({ name: 'SPASSWORD3', type: 'varchar', length: 50, nullable: true })
  spassword3: string;

  @Column({ name: 'RESIGNDATE', type: 'date', nullable: true })
  resigndate: Date;

  @Column({ name: 'JOBTYPE', type: 'char', length: 2, nullable: true })
  jobtype: string;

  @Column({ name: 'CREUSRDATE', type: 'date', nullable: true })
  creusrdate: Date;

  @Column({ name: 'UPDUSRDATE', type: 'date', nullable: true })
  updusrdate: Date;
}
