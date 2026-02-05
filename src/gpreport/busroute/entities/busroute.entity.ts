import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('BUS_ROUTE')
export class Busroute {
  @PrimaryColumn()
  BUSLINE: number;

  @PrimaryColumn()
  STOPNO: number;

  @Column()
  NEXTSTOP: number;

  @Column()
  STATENO: number;

  @Column()
  IS_START: string;
}
