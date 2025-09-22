import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricelistService } from './pricelist.service';
import { PricelistController } from './pricelist.controller';
import { Pricelist } from './entities/pricelist.entity';
import { ItemsCustomer } from '../items-customer/entities/items-customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pricelist], 'spsysConnection'),
    TypeOrmModule.forFeature([ItemsCustomer], 'spsysConnection'),
  ],
  controllers: [PricelistController],
  providers: [PricelistService],
})
export class PricelistModule {}
