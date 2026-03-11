import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BusDispatchLine } from './bus_dispatch_line.entity';

@Entity({ name: 'BUS_DISPATCH_HEAD' })
export class BusDispatchHead {
  @PrimaryGeneratedColumn({ name: 'DISPATCH_ID', type: 'number' })
  dispatch_id: number;

  @Column({ name: 'DISPATCH_DATE', type: 'date' })
  dispatch_date: Date;

  @Column({ name: 'DISPATCH_TYPE', type: 'varchar2', length: 1, nullable: true })
  dispatch_type: string | null;

  @Column({ name: 'SHIFT', type: 'varchar2', length: 1 })
  shift: string;

  @Column({ name: 'STATUS', type: 'varchar2', length: 1, nullable: true })
  status: string | null;

  @Column({ name: 'UPDATE_BY', type: 'varchar2', length: 5, nullable: true })
  update_by: string | null;

  @Column({ name: 'UPDATE_DATE', type: 'date', nullable: true })
  update_date: Date | null;

  @OneToMany(() => BusDispatchLine, (l) => l.head)
  lines: BusDispatchLine[];
}