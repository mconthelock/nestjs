import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';

import { StocksService } from './stocks.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('pursys/stocks')
export class StocksController {
    constructor(private readonly stocks: StocksService) {}

    @Post('issue')
    @UseTransaction('purConnection')
    issueStock(@Body() trns: CreateTransactionDto) {
        return this.stocks.createStockTransaction(trns, 1);
    }

    @Post('receive')
    @UseTransaction('purConnection')
    receiveStock(@Body() trns: CreateTransactionDto) {
        return this.stocks.createStockTransaction(trns, 2);
    }
}
