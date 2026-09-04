import {
    Column,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { StockTransactionItems } from './STOCK_TRANSACTION_ITEMS.entity';
import { StockTransactionsType } from './STOCK_TRANSACTION_TYPES.entity';

@Entity({ name: 'STOCK_TRANSACTIONS', schema: 'PURSYS' })
export class StockTransactions {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    DOCUMENT_NO: string;

    @Column()
    TRNTYPE?: number;

    @Column()
    STORAGE_FROM: number;

    @Column()
    STORAGE_TO: number;

    @Column()
    CSTATUS: string;

    @Column()
    CREATED_AT: Date;

    @Column()
    CREATED_BY: string;

    @OneToMany(() => StockTransactionItems, (item) => item.TRANSACTION_ID)
    ITEMS: StockTransactionItems[];

    @OneToOne(() => StockTransactionsType, (type) => type.TYPE_ID)
    TYPE: StockTransactionsType;
}
