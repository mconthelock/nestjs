import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from 'typeorm';
import { BusDispatchHead } from './bus_dispatch_head.entity';
import { BusDispatchStop } from './bus_dispatch_stop.entity';

@Entity({ name: 'BUS_DISPATCH_LINE' })
export class BusDispatchLine {
    @PrimaryColumn()
    DISPATCH_ID: number;

    @PrimaryColumn()
    BUSID: number;

    @Column()
    BUSNAME: string | null;

    @Column()
    BUSTYPE: string | null;

    @Column()
    BUSSEAT: number | null;

    @Column()
    LINE_STATUS: string | null;

    @ManyToOne(() => BusDispatchHead, (h) => h.lines, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'DISPATCH_ID', referencedColumnName: 'DISPATCH_ID' })
    head: BusDispatchHead;

    @OneToMany(() => BusDispatchStop, (s) => s.line)
    stops: BusDispatchStop[];
}
