import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Like, Not } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';

import { StockTransactions } from 'src/common/Entities/pursys/table/STOCK_TRANSACTIONS.entity';
import { StockTransactionItems } from 'src/common/Entities/pursys/table/STOCK_TRANSACTION_ITEMS.entity';
import { StockBalances } from 'src/common/Entities/pursys/table/STOCK_BALANCES.entity';
// import { InventoryBal ances } from 'src/common/Entities/pursys/table/INVENTORY_BALANCES.entity';

@Injectable()
export class StocksRepository extends BaseRepository {
    constructor(@InjectDataSource('purConnection') ds: DataSource) {
        super(ds);
    }

    async searchStockTransaction(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(StockTransactions, 'trns');
        await applyDynamicFilters(qb, dto, 'trns');
        return qb.getMany();
    }

    async createStockTransaction(
        stock: Partial<StockTransactions>,
        items: Partial<StockTransactionItems>[],
    ) {
        try {
            const transaction =
                await this.getRepository(StockTransactions).save(stock);
            for (const item of items) {
                const itemData: Partial<StockTransactionItems> = {
                    TRANSACTION_ID: transaction.ID,
                    PRODUCT_ID: item.PRODUCT_ID,
                    LOT_ID: item.LOT_ID,
                    QUANTITY: item.QUANTITY,
                    UNIT_COST: item.UNIT_COST,
                    REMARK: item.REMARK,
                };
                await this.getRepository(StockTransactionItems).save(itemData);

                // Update stock balances
                if (stock.STORAGE_FROM) {
                    const balance = await this.getRepository(
                        StockBalances,
                    ).findOne({
                        where: {
                            PRODUCT_ID: item.PRODUCT_ID,
                            STORAGENO: stock.STORAGE_FROM,
                        },
                    });
                    if (!balance)
                        throw new Error(
                            `Stock balance not found for product ${item.PRODUCT_ID} in storage ${stock.STORAGE_FROM}`,
                        );
                    balance.ONHAND = balance.ONHAND - item.QUANTITY;
                    await this.getRepository(StockBalances).save(balance);
                }

                if (stock.STORAGE_TO) {
                    const toBalance = await this.getRepository(
                        StockBalances,
                    ).findOne({
                        where: {
                            PRODUCT_ID: item.PRODUCT_ID,
                            STORAGENO: stock.STORAGE_TO,
                        },
                    });
                    if (toBalance) {
                        toBalance.ONHAND = toBalance.ONHAND + item.QUANTITY;
                        await this.getRepository(StockBalances).save(toBalance);
                    } else {
                        const newBalance: Partial<StockBalances> = {
                            PRODUCT_ID: item.PRODUCT_ID,
                            STORAGENO: stock.STORAGE_TO,
                            MIN_QTY: 0,
                            ONORDER: 0,
                            ONHAND: item.QUANTITY,
                            ONRESERVE: 0,
                            UPDATE_AT: new Date(),
                            UPDATE_BY: 'system',
                        };
                        await this.getRepository(StockBalances).save(
                            newBalance,
                        );
                    }
                }
            }
            return transaction;
        } catch (error) {
            throw error;
        }
    }
}
