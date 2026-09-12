import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AmecOrders } from './amecorders.entity';
import { AmecOrdersSchedule } from './amecorders_schedule.entity';

@Entity({ name: 'AMECORDERS_PACKNO', schema: 'WORKLOAD' })
export class AmecOrdersPackNo {
    @PrimaryColumn()
    ORDERNO: string;

    @PrimaryColumn()
    PACKNO: string;

    @Column()
    PACKSHOP: string;

    @Column()
    SHIPFORM: string;

    @Column()
    BLOCK: string;

    @Column()
    SECT: string;

    @Column()
    BLOCK_PACKING: string;

    @Column()
    SECT_PACKING: string;

    @Column()
    REMARK: string;

    @ManyToOne(() => AmecOrders, (ord) => ord.packing)
    @JoinColumn({ name: 'ORDERNO', referencedColumnName: 'MFGNO' })
    detail: AmecOrders;

    // @ManyToOne(
    //     () => AmecOrdersSchedule,
    //     (amecOrdersSchedule) => amecOrdersSchedule,
    // )
    // @JoinColumn({ name: 'ORDERNO', referencedColumnName: 'REFMFGNO' })
    // schedule: AmecOrdersSchedule;
}
