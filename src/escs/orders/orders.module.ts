import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orders], 'amecConnection')],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
