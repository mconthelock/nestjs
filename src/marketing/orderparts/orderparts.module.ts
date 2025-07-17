import { Module } from '@nestjs/common';
import { OrderpartsService } from './orderparts.service';
import { OrderpartsController } from './orderparts.controller';

@Module({
  controllers: [OrderpartsController],
  providers: [OrderpartsService],
})
export class OrderpartsModule {}
