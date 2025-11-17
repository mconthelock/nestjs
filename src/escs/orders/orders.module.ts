import { Module } from '@nestjs/common';
import { ESCSOrdersService } from './orders.service';
import { ESCSOrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orders], 'escsConnection')],
  controllers: [ESCSOrdersController],
  providers: [ESCSOrdersService],
})
export class ESCSOrdersModule {}
