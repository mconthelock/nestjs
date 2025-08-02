import { Module } from '@nestjs/common';
import { OrderListService } from './orderlist.service';
import { OrderListController } from './orderlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VOrderList } from './entities/orderlist.entity';
import { SetRequestDateModule } from '../set-request-date/set-request-date.module';
import { SetRequestDate } from '../set-request-date/entities/set-request-date.entity';
import { JopMarReqModule } from '../jop-mar-req/jop-mar-req.module';
import { JopPurConfModule } from '../jop-pur-conf/jop-pur-conf.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VOrderList], 'amecConnection'),
    TypeOrmModule.forFeature([SetRequestDate], 'amecConnection'),
    SetRequestDateModule,
    JopMarReqModule,
    JopPurConfModule
  ],
  controllers: [OrderListController],
  providers: [OrderListService],
})
export class OrderListModule {}
