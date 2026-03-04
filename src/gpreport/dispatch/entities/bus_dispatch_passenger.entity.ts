import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { BusDispatchStop } from './bus_dispatch_stop.entity';

@Entity({ name: 'BUS_DISPATCH_PASSENGER' })
export class BusDispatchPassenger {
  @PrimaryColumn({ name: 'DISPATCH_ID', type: 'number' })
  dispatch_id: number;

  @Column({ name: 'STOP_ID', type: 'number' })
  stop_id: number;

  @PrimaryColumn({ name: 'EMPNO', type: 'varchar2', length: 5 })
  empno: string;

  @ManyToOne(() => BusDispatchStop, (s) => s.passengers, { onDelete: 'CASCADE' })
  @JoinColumn([
    { name: 'DISPATCH_ID', referencedColumnName: 'dispatch_id' },
    { name: 'STOP_ID', referencedColumnName: 'stop_id' },
  ])
  stop: BusDispatchStop;
}