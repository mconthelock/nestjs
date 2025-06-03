import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('AMECUSERALL')
export class User {
  @PrimaryColumn({ name: 'SEMPNO', type: 'varchar', length: 5 })
  sempno: string;

  @Column({ name: 'SNAME', type: 'varchar', length: 50 })
  sname: string;

  @Column({ name: 'SSEC', type: 'varchar', length: 100 })
  ssec: string;

  @Column({ name: 'SDEPT', type: 'varchar', length: 100 })
  sdept: string;

  @Column({ name: 'SDIV', type: 'varchar', length: 100 })
  sdiv: string;

  @Column({ name: 'SSECCODE', type: 'varchar', length: 6 })
  sseccode: string;

  @Column({ name: 'SDEPCODE', type: 'varchar', length: 6 })
  sdepcode: string;

  @Column({ name: 'SDIVCODE', type: 'varchar', length: 6 })
  sdivcode: string;

  @Column({ name: 'SRECMAIL', type: 'varchar', length: 120 })
  srecmail: string;

  @Column({ name: 'SPOSCODE', type: 'varchar', length: 2 })
  sposcode: string;

  @Column({ name: 'SPOSNAME', type: 'varchar', length: 100 })
  sposname: string;

  @Column({ name: 'SPASSWORD1', type: 'varchar', length: 132 })
  spassword1: string;
}
