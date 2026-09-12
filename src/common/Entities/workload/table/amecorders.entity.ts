import {
    Entity,
    Column,
    PrimaryColumn,
    OneToMany,
    JoinColumn,
    OneToOne,
} from 'typeorm';
import { AmecOrdersPackNo } from './AMECORDERS_PACKNO.entity';
import { AmecOrdersSchedule } from './amecorders_schedule.entity';

@Entity({ name: 'AMECORDERS', schema: 'WORKLOAD' })
export class AmecOrders {
    @PrimaryColumn()
    MFGNO: string;

    @Column()
    REVISION: string;

    @Column()
    PONO: string;

    @Column()
    PRODTYPE: string;

    @Column()
    SERIES: string;

    @Column()
    IDS_DATE: Date;

    @Column()
    CUSTOMER_REQ: Date;

    @Column()
    MAINQTY: number;

    @Column()
    PARTQTY: number;

    @Column()
    PRJ_NO: string;

    @Column()
    PRJ_NAME: string;

    @Column()
    AGENT: string;

    @Column()
    COUNTRY: string;

    @Column()
    SALE_COMPANY: string;

    @Column()
    PORT: string;

    @Column()
    STATUS: number;

    @Column()
    REMARK: string;

    @Column()
    SPEC: string;

    @OneToOne(() => AmecOrdersSchedule, (schedule) => schedule.ord)
    @JoinColumn({ name: 'MFGNO', referencedColumnName: 'REFMFGNO' })
    schedule: AmecOrdersSchedule;

    @OneToMany(() => AmecOrdersPackNo, (pack) => pack.detail)
    @JoinColumn({ name: 'MFGNO', referencedColumnName: 'ORDERNO' })
    packing: AmecOrdersPackNo[];
}
