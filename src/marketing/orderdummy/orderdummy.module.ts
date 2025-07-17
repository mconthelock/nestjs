import { Module } from '@nestjs/common';
import { OrderdummyService } from './orderdummy.service';
import { OrderdummyController } from './orderdummy.controller';

@Module({
  controllers: [OrderdummyController],
  providers: [OrderdummyService],
})
export class OrderdummyModule {}
