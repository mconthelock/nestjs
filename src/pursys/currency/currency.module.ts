import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';

import { CurrencyMaster } from 'src/common/Entities/pursys/table/CURRENCY_MASTER.entity';
import { CurrencyExchange } from 'src/common/Entities/pursys/table/CURRENCY_EXCHANGE.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [CurrencyMaster, CurrencyExchange],
            'purConnection',
        ),
    ],
    controllers: [CurrencyController],
    providers: [CurrencyService],
})
export class CurrencyModule {}
