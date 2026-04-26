import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { BusDispatchStop } from './bus_dispatch_stop.entity';

@Entity({ name: 'BUS_DISPATCH_PASSENGER' })
export class BusDispatchPassenger {
    @PrimaryColumn()
    DISPATCH_ID: number;

    @Column()
    STOP_ID: number;

    @PrimaryColumn()
    EMPNO: string;

    @Column()
    STATUS: string;

    @ManyToOne(() => BusDispatchStop, (s) => s.passengers, {
        onDelete: 'CASCADE',
    })
    @JoinColumn([
        { name: 'DISPATCH_ID', referencedColumnName: 'DISPATCH_ID' },
        { name: 'STOP_ID', referencedColumnName: 'STOP_ID' },
    ])
    stop: BusDispatchStop;
}
