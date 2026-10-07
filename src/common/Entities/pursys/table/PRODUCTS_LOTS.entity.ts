import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'PRODUCTS_LOTS', schema: 'PURSYS' })
export class ProductsLots {
    @PrimaryGeneratedColumn()
    LOT_ID: number;

    @Column()
    PRODUCT_ID: number;

    @Column()
    LOT_NUMBER: string;

    @Column()
    MFG_DATE: Date;

    @Column()
    EXPIRY_DATE: Date;

    @Column()
    RECEIVED_DATE: Date;

    @Column()
    IS_ACTIVE: number;
}
