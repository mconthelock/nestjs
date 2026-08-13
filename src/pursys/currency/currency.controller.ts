import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

@Controller('pursys/currency')
export class CurrencyController {
    constructor(private readonly currencyService: CurrencyService) {}

    @Get('master')
    findAll() {
        return this.currencyService.findAllMaster();
    }

    @Get('exchange')
    findAllExchange() {
        return this.currencyService.findAllExchange();
    }
}
