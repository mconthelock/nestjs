import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BusDispatchLine } from './bus_dispatch_line.entity';

@Entity({ name: 'BUS_DISPATCH_HEAD' })
export class BusDispatchHead {
    @PrimaryGeneratedColumn()
    DISPATCH_ID: number;

    @Column()
    DISPATCH_DATE: Date;

    @Column()
    DISPATCH_TYPE: string | null;

    @Column()
    SHIFT: string;

    @Column()
    STATUS: string | null;

    @Column()
    UPDATE_BY: string | null;

    @Column()
    UPDATE_DATE: Date | null;

    @OneToMany(() => BusDispatchLine, (l) => l.head)
    lines: BusDispatchLine[];
}
