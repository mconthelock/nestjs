import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Busline } from './busline.entity';
import { Busstop } from './busstop.entity';

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


  @ManyToOne(() => Busline, (l) => l.busmst)
  @JoinColumn({ name: 'BUSLINE', referencedColumnName: 'BUSID' })
  busmaster: Busline;

  @ManyToOne(() => Busstop, (s) => s.routes)
  @JoinColumn({ name: 'STOPNO', referencedColumnName: 'STOP_ID' })
  stop: Busstop;

}
