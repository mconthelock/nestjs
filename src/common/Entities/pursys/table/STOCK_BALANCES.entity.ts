import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'STOCK_BALANCES', schema: 'PURSYS' })
export class StockBalances {
    @PrimaryColumn()
    PRODUCT_ID: number;

    @PrimaryColumn()
    STORAGENO: number;

    @Column()
    MIN_QTY: number;

    @Column()
    ONORDER: number;

    @Column()
    ONHAND: number;

    @Column()
    ONRESERVE: number;

    @Column()
    UPDATE_AT: Date;

    @Column()
    UPDATE_BY: string;
}
