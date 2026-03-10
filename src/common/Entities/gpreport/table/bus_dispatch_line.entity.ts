import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { BusDispatchHead } from './bus_dispatch_head.entity';
import { BusDispatchStop } from './bus_dispatch_stop.entity';

@Entity({ name: 'BUS_DISPATCH_LINE' })
export class BusDispatchLine {
  @PrimaryColumn({ name: 'DISPATCH_ID', type: 'number' })
  dispatch_id: number;

  @PrimaryColumn({ name: 'BUSID', type: 'number' })
  busid: number;

  @Column({ name: 'BUSNAME', type: 'varchar2', length: 100, nullable: true })
  busname: string | null;

  @Column({ name: 'BUSTYPE', type: 'varchar2', length: 1, nullable: true })
  bustype: string | null;

  @Column({ name: 'BUSSEAT', type: 'number', nullable: true })
  busseat: number | null;

  @Column({ name: 'LINE_STATUS', type: 'varchar2', length: 1, nullable: true })
  line_status: string | null;

  @ManyToOne(() => BusDispatchHead, (h) => h.lines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'DISPATCH_ID', referencedColumnName: 'dispatch_id' })
  head: BusDispatchHead;

  @OneToMany(() => BusDispatchStop, (s) => s.line)
  stops: BusDispatchStop[];
}