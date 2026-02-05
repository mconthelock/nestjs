import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('BUS_PASSENGER')
export class Buspassenger {
  @PrimaryColumn()
  EMPNO: string;

  @PrimaryColumn()
  STATENO: number;

  @Column()
  BUSSTOP: number;

  @Column()
  UPDATE_DATE: Date;

  @Column()
  UPDATE_BY: string;
}
