import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    schema: 'PURSYS',
    name: 'PRODUCTS',
})
export class PRODUCTS {
    @PrimaryColumn()
    PRODUCT_ID: string;

    @Column()
    CATEGORY_ID: string;

    @Column()
    SKU: string;

    @Column()
    NAME: string;

    @Column()
    BASE_PRICE: string;

    @Column()
    CATEGORY_SPECS: string;

    @Column()
    CREATED_AT: string;

    @Column()
    IS_STOCK_MANAGED: string;
}
