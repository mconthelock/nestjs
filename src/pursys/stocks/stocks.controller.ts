import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Controller('pursys/stocks')
export class StocksController {
    constructor(private readonly stocks: StocksService) {}

    @Post('issue')
    issueStock(@Body() createStockDto: CreateStockDto) {
        return this.stocks.issueStock(createStockDto);
    }

    @Post('receive')
    receiveStock(@Body() createStockDto: CreateStockDto) {
        return this.stocks.receiveStock(createStockDto);
    }
}
