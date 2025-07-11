import { Module } from '@nestjs/common';
import { OrderListService } from './orderlist.service';
import { OrderListController } from './orderlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VOrderList } from './entities/orderlist.entity';
import { SetRequestDateModule } from '../set-request-date/set-request-date.module';
import { SetRequestDate } from '../set-request-date/entities/set-request-date.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VOrderList], 'amecConnection'),
    TypeOrmModule.forFeature([SetRequestDate], 'amecConnection'),
    SetRequestDateModule,
  ],
  controllers: [OrderListController],
  providers: [OrderListService],
})
export class OrderListModule {}
