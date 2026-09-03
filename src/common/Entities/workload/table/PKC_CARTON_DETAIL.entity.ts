import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PKC_CARTON_DETAIL', schema: 'WORKLOAD' })
export class PKC_CARTON_DETAIL {
    @PrimaryColumn()
    ORDER_NO: string;

    @Column()
    PACKING_NO: string;

    @Column()
    CARTONBOX: string;

    @Column()
    QTY: number;

    @Column()
    CREATED_BY: string;

    @Column({
        type: 'date',
        default: () => 'SYSDATE',
    })
    CREATED_AT: Date;
}
