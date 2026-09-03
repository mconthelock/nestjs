import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'INVENTORY_BALANCES', schema: 'PURSYS' })
export class InventoryBalances {
    @PrimaryGeneratedColumn()
    BALANCE_ID: number;

    @Column()
    WAREHOUSE_ID: number;

    @Column()
    PRODUCT_ID: number;

    @Column()
    LOT_ID: number;

    @Column()
    QUANTITY: number;

    @Column()
    RESERVED_QUANTITY: number;

    @Column()
    UPDATED_AT: Date;
}
