import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { Currency } from './entities/currency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Currency], 'amecConnection')],
  controllers: [CurrencyController],
  providers: [CurrencyService],
})
export class CurrencyModule {}
