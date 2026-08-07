import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'DPMS_ORDERS', schema: 'WORKLOAD' })
export class DpmsOrders {
    @PrimaryColumn()
    ORDERNO: string;

    @Column()
    ACCEPT_MFGDATE: Date;

    @Column()
    ACCEPT_DCDATE: Date;
}
