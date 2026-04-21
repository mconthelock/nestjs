import { Module } from '@nestjs/common';
import { OrdersDrawingService } from './orders-drawing.service';
import { OrdersDrawingController } from './orders-drawing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORDERS_DRAWING } from 'src/common/Entities/escs/table/ORDERS_DRAWING.entity';
import { OrdersDrawingRepository } from './orders-drawing.repository';

@Module({
    imports: [TypeOrmModule.forFeature([ORDERS_DRAWING], 'escsConnection')],
    controllers: [OrdersDrawingController],
    providers: [OrdersDrawingService, OrdersDrawingRepository],
    exports: [OrdersDrawingService],
})
export class OrdersDrawingModule {}
