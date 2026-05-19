import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    schema: 'PURSYS',
    name: 'STOCK',
})
export class STOCK {
    @PrimaryColumn()
    PRODUCT_ID: string;

    @Column()
    QUANTITY: string;

    @Column()
    MIN_THRESHOLD: string;

    @Column()
    LOCATION: string;

    @Column()
    LAST_UPDATED: string;
}
