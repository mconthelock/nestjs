import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';

import { Warehouses } from 'src/common/Entities/pursys/table/WAREHOUSES.entity';
import { StockMovements } from 'src/common/Entities/pursys/table/STOCK_MOVEMENTS.entity';
import { StockMovementItems } from 'src/common/Entities/pursys/table/STOCK_MOVEMENT_ITEMS.entity';
import { ProductsLots } from 'src/common/Entities/pursys/table/PRODUCTS_LOTS.entity';
import { InventoryBalances } from 'src/common/Entities/pursys/table/INVENTORY_BALANCES.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                Warehouses,
                StockMovements,
                StockMovementItems,
                ProductsLots,
                InventoryBalances,
            ],
            'purConnection',
        ),
    ],
    controllers: [StocksController],
    providers: [StocksService],
})
export class StocksModule {}
