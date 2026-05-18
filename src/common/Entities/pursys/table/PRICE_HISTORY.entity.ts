import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    schema: 'PURSYS',
    name: 'PRICE_HISTORY',
})
export class PRICE_HISTORY {
    @PrimaryColumn()
    PRICE_ID: number;

    @Column()
    PRODUCT_ID: string;

    @Column()
    OLD_PRICE: number;

    @Column()
    NEW_PRICE: number;

    @Column()
    CHANGE_REASON: string;

    @Column()
    CHANGED_AT: Date;
}
