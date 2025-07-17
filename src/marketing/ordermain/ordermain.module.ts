import { Module } from '@nestjs/common';
import { OrdermainService } from './ordermain.service';
import { OrdermainController } from './ordermain.controller';

@Module({
  controllers: [OrdermainController],
  providers: [OrdermainService],
})
export class OrdermainModule {}
