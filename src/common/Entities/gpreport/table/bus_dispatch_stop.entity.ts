import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from 'typeorm';
import { BusDispatchLine } from './bus_dispatch_line.entity';
import { BusDispatchPassenger } from './bus_dispatch_passenger.entity';

@Entity({ name: 'BUS_DISPATCH_STOP' })
export class BusDispatchStop {
    @PrimaryColumn()
    DISPATCH_ID: number;

    @Column() // value = BUSID
    LINE_ID: number;

    @PrimaryColumn()
    STOP_ID: number;

    @Column()
    STOP_NAME: string | null;

    @Column()
    PLAN_TIME: string | null;

    @ManyToOne(() => BusDispatchLine, (l) => l.stops, { onDelete: 'CASCADE' })
    @JoinColumn([
        { name: 'DISPATCH_ID', referencedColumnName: 'DISPATCH_ID' },
        { name: 'LINE_ID', referencedColumnName: 'BUSID' },
    ])
    line: BusDispatchLine;

    @OneToMany(() => BusDispatchPassenger, (p) => p.stop)
    passengers: BusDispatchPassenger[];
}
