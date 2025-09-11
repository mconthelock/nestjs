import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricelistService } from './pricelist.service';
import { Pricelist } from './entities/pricelist.entity';
import { PricelistController } from './pricelist.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pricelist], 'spsysConnection')],
  controllers: [PricelistController],
  providers: [PricelistService],
})
export class PricelistModule {}
