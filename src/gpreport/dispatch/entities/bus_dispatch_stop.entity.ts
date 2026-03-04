import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { BusDispatchLine } from './bus_dispatch_line.entity';
import { BusDispatchPassenger } from './bus_dispatch_passenger.entity';

@Entity({ name: 'BUS_DISPATCH_STOP' })
export class BusDispatchStop {
  @PrimaryColumn({ name: 'DISPATCH_ID', type: 'number' })
  dispatch_id: number;

  @Column({ name: 'LINE_ID', type: 'number' })
  line_id: number;

  @PrimaryColumn({ name: 'STOP_ID', type: 'number' })
  stop_id: number;

  @Column({ name: 'STOP_NAME', type: 'varchar2', length: 100, nullable: true })
  stop_name: string | null;

  @Column({ name: 'PLAN_TIME', type: 'varchar2', length: 4, nullable: true })
  plan_time: string | null;


  @ManyToOne(() => BusDispatchLine, (l) => l.stops, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'LINE_ID', referencedColumnName: 'line_id' })
  line: BusDispatchLine;

  @OneToMany(() => BusDispatchPassenger, (p) => p.stop)
  passengers: BusDispatchPassenger[];
}