import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CurrencyMaster } from 'src/common/Entities/pursys/table/CURRENCY_MASTER.entity';
import { CurrencyExchange } from 'src/common/Entities/pursys/table/CURRENCY_EXCHANGE.entity';

import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

@Injectable()
export class CurrencyService {
    constructor(
        @InjectRepository(CurrencyMaster, 'mitsuConnection')
        private readonly curr: Repository<CurrencyMaster>,
        @InjectRepository(CurrencyExchange, 'mitsuConnection')
        private readonly exch: Repository<CurrencyExchange>,
    ) {}

    findAllMaster() {
        return this.curr.find();
    }

    findAllExchange() {
        return this.exch.find({ relations: ['master'] });
    }
}
