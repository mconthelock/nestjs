import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdermainService } from './ordermain.service';
import { OrdermainController } from './ordermain.controller';
import { Ordermain } from './entities/ordermain.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ordermain], 'amecConnection')],
  controllers: [OrdermainController],
  providers: [OrdermainService],
})
export class OrdermainModule {}
