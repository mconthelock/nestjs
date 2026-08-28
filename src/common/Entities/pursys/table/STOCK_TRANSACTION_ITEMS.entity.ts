import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'STOCK_TRANSACTION_ITEMS', schema: 'PURSYS' })
export class StockTransactionItems {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    TRANSACTION_ID: number;

    @Column()
    PRODUCT_ID: number;

    @Column()
    LOT_ID: number;

    @Column({ type: 'decimal', precision: 10, scale: 4 })
    QUANTITY: number;

    @Column({ type: 'decimal', precision: 10, scale: 4 })
    UNIT_COST: number;

    @Column()
    REMARK: string;
}
