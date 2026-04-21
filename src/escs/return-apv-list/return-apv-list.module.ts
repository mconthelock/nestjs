import { Module } from '@nestjs/common';
import { ReturnApvListService } from './return-apv-list.service';
import { ReturnApvListController } from './return-apv-list.controller';
import { ReturnApvListRepository } from './return-apv-list.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RETURN_APV_LIST } from 'src/common/Entities/escs/table/RETURN_APV_LIST.entity';
import { OrdersDrawingModule } from '../orders-drawing/orders-drawing.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([RETURN_APV_LIST], 'escsConnection'),
        OrdersDrawingModule,
    ],
    controllers: [ReturnApvListController],
    providers: [ReturnApvListService, ReturnApvListRepository],
    exports: [ReturnApvListService],
})
export class ReturnApvListModule {}
