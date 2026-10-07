import {
    Entity,
    Column,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
    OneToOne,
} from 'typeorm';
import { AmecOrders } from './amecorders.entity';
import { PisPages } from './pis-pages.entity';

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

    @OneToOne(() => PisPages, (pisPages) => pisPages)
    @JoinColumn({ name: 'ORDERNO', referencedColumnName: 'PAGE_MFGNO' })
    @JoinColumn({ name: 'PACKNO', referencedColumnName: 'PAGE_PACKING' })
    printed: PisPages;
}
