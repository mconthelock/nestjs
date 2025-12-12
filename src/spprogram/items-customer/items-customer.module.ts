import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsCustomerService } from './items-customer.service';
import { ItemsCustomerController } from './items-customer.controller';

import { ItemsCustomer } from './entities/items-customer.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ItemsCustomer], 'spsysConnection')],
  controllers: [ItemsCustomerController],
  providers: [ItemsCustomerService],
  exports: [ItemsCustomerService],
})
export class ItemsCustomerModule {}
