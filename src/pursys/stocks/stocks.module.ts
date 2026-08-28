import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { StocksRepository } from './stocks.repository';

import { Warehouses } from 'src/common/Entities/pursys/table/WAREHOUSES.entity';
import { StockTransactions } from 'src/common/Entities/pursys/table/STOCK_TRANSACTIONS.entity';
import { StockTransactionItems } from 'src/common/Entities/pursys/table/STOCK_TRANSACTION_ITEMS.entity';
import { StockBalances } from 'src/common/Entities/pursys/table/STOCK_BALANCES.entity';
import { ProductsLots } from 'src/common/Entities/pursys/table/PRODUCTS_LOTS.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                Warehouses,
                ProductsLots,
                StockTransactions,
                StockTransactionItems,
                StockBalances,
            ],
            'purConnection',
        ),
    ],
    controllers: [StocksController],
    providers: [StocksService, StocksRepository],
})
export class StocksModule {}
