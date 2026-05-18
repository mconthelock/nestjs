import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    schema: 'PURSYS',
    name: 'STOCK_TRANSACTIONS',
})
export class STOCK_TRANSACTIONS {
    @PrimaryColumn()
    TRANSACTION_ID: string;

    @Column()
    PRODUCT_ID: string;

    @Column()
    TRAN_TYPE: string;

    @Column()
    QUANTITY: string;

    @Column()
    REF_NO: string;

    @Column()
    REMARKS: string;

    @Column()
    CREATED_BY: string;

    @Column()
    CREATED_AT: string;
}
