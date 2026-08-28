import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'IDTAGS_ORDERS', schema: 'WORKLOAD' })
export class IdtagOrders {
    @PrimaryColumn()
    FILE_ID: number;

    @PrimaryColumn()
    FILE_PAGE: number;

    @Column()
    FILE_TAG: string;

    @PrimaryColumn()
    FILE_ORDER: string;

    @Column()
    FILE_ORDER_QTY: number;
}
