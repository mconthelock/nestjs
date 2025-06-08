import { Module } from '@nestjs/common';
import { OrderListService } from './orderlist.service';
import { OrderListController } from './orderlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VOrderList } from './entities/orderlist.entity';

@Module({
imports: [TypeOrmModule.forFeature([VOrderList], 'amecConnection')],
  controllers: [OrderListController],
  providers: [OrderListService],
})
export class OrderListModule {}
