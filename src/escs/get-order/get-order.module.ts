import { Module } from '@nestjs/common';
import { GetOrderService } from './get-order.service';
import { GetOrderController } from './get-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GET_ORDER } from 'src/common/Entities/escs/views/GET_ORDER.entity';
import { GetOrderRepository } from './get-order.repository';

@Module({
    imports: [TypeOrmModule.forFeature([GET_ORDER], 'escsConnection')],
    controllers: [GetOrderController],
    providers: [GetOrderService, GetOrderRepository],
    exports: [GetOrderService],
})
export class GetOrderModule {}
