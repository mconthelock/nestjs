import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsCustomerService } from './items-customer.service';
import { ItemsCustomer } from './entities/items-customer.entity';
import { ItemsCustomerController } from './items-customer.controller';

@Module({
  controllers: [ItemsCustomerController],
  imports: [
    TypeOrmModule.forFeature([ItemsCustomer], 'amecConnection')
  ],
  providers: [ItemsCustomerService],
})
export class ItemsCustomerModule {}
