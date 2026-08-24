import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'STOCK_MOVEMENT_ITEMS', schema: 'PURSYS' })
export class StockMovementItems {
    @PrimaryGeneratedColumn()
    ITEM_ID: number;

    @Column()
    MOVEMENT_ID: number;

    @Column()
    PRODUCT_ID: number;

    @Column()
    LOT_ID: number;

    @Column()
    QUANTITY: number;

    @Column()
    UNIT_COST: number;

    @Column()
    REMARK: string;
}
