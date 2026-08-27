import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StocksRepository } from './stocks.repository';
import { StockTransactions } from 'src/common/Entities/pursys/table/STOCK_TRANSACTIONS.entity';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { StockTransactionItems } from 'src/common/Entities/pursys/table/STOCK_TRANSACTION_ITEMS.entity';
// import { UpdateStockDto } from './dto/update-transaction.dto';

@Injectable()
export class StocksService {
    constructor(protected readonly repo: StocksRepository) {}

    async searchStockTransaction(q?: any) {}

    async createStockTransaction(data: CreateTransactionDto, type: number) {
        const transactionData: Partial<StockTransactions> = {
            DOCUMENT_NO: data.DOCUMENT_NO,
            TRNTYPE: type,
            STORAGE_FROM: data.STORAGE_FROM,
            STORAGE_TO: data.STORAGE_TO,
            CSTATUS: data.CSTATUS,
            CREATED_AT: data.CREATED_AT,
            CREATED_BY: data.CREATED_BY,
        };
        const transactionItems: Partial<StockTransactionItems>[] = data.ITEMS;
        return this.repo.createStockTransaction(
            transactionData,
            transactionItems,
        );
    }
}
