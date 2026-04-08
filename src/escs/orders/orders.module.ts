import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORDERS } from 'src/common/Entities/escs/table/ORDERS.entity';
import { OrdersRepository } from './orders.repository';

@Module({
    imports: [TypeOrmModule.forFeature([ORDERS], 'escsConnection')],
    controllers: [OrdersController],
    providers: [OrdersService, OrdersRepository],
    exports: [OrdersService],
})
export class OrdersModule {}
