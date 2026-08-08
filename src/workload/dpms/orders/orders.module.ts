import { Module } from '@nestjs/common';
import { DpmsOrdersService } from './orders.service';
import { DpmsOrdersController } from './orders.controller';

@Module({
    controllers: [DpmsOrdersController],
    providers: [DpmsOrdersService],
})
export class DpmsOrdersModule {}
