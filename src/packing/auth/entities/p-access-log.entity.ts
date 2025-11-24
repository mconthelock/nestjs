import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('PAccessLog')
export class PAccessLog {
  @PrimaryGeneratedColumn()
  alogId: number;

  @Column()
  usrid: string;

  @Column()
  accessid: string;

  @Column()
  accessip: string;

  @Column()
  accesstime: Date;

  @Column()
  endtime: Date;

  @Column()
  accesslocal: boolean;
}
