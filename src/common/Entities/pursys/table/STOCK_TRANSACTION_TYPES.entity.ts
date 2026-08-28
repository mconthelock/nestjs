import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'STOCK_TRANSACTION_TYPES', schema: 'PURSYS' })
export class StockTransactionsType {
    @PrimaryGeneratedColumn()
    TYPE_ID: number;

    @Column()
    TYPE_NAME: string;

    @Column()
    TYPE_STATUS: string;
}
