import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { BrcurrencyService } from './brcurrency.service';
import { CreateBrcurrencyDto } from './dto/create-brcurrency.dto';
import { UpdateBrcurrencyDto } from './dto/update-brcurrency.dto';

@Controller('amec/brcurrency')
export class BrcurrencyController {
    constructor(private readonly brcurrencyService: BrcurrencyService) {}

    @Get('currency')
    findCurrency() {
        return this.brcurrencyService.findCurrency();
    }
}
