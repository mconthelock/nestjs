import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AmecOrders } from './amecorders.entity';
import { Problemaster } from './DPMS_PROBLEM_MASTER.entity';
import { AmecOrdersSchedule } from './amecorders_schedule.entity';

@Entity({ name: 'DPMS_ORDERS_ITEM', schema: 'WORKLOAD' })
export class DpmsOrdersItem {
    @PrimaryColumn()
    ORDERNO: string;

    @PrimaryColumn()
    ITEMNO: string;

    @Column()
    PIS_ISSUEDATE: Date;

    @Column()
    PIS_RECEIVEDATE: Date;

    @Column()
    PB_CODE: string;

    @Column()
    PB_DETAIL: string;

    @Column()
    PB_USER: string;

    @Column()
    PB_DATE: Date;

    @Column()
    ITEM_ACCEPT_USER: string;

    @Column()
    ITEM_ACCEPT_DATE: Date;

    @Column()
    ITEM_ACCEPT_REMARK: string;

    @Column()
    USER_UPDATE: string;

    @Column()
    DATE_UPDATE: Date;

    @ManyToOne(() => AmecOrders, (order) => order.MFGNO)
    @JoinColumn({ name: 'ORDERNO', referencedColumnName: 'MFGNO' })
    orders: AmecOrders;

    @ManyToOne(() => Problemaster, (pb) => pb.PB_CODE)
    @JoinColumn({ name: 'PB_CODE', referencedColumnName: 'PB_CODE' })
    problem: Problemaster;

    @ManyToOne(() => AmecOrdersSchedule, (schedule) => schedule.REFMFGNO)
    @JoinColumn({ name: 'ORDERNO', referencedColumnName: 'REFMFGNO' })
    schedule: AmecOrdersSchedule;
}
