import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsCustomerService } from './items-customer.service';
import { ItemsCustomer } from './entities/items-customer.entity';
import { ItemsCustomerController } from './items-customer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ItemsCustomer], 'spsysConnection')],
  controllers: [ItemsCustomerController],
  providers: [ItemsCustomerService],
  exports: [ItemsCustomerService],
})
export class ItemsCustomerModule {}
