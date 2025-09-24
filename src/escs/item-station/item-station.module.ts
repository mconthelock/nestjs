import { Module } from '@nestjs/common';
import { ESCSItemStationService } from './item-station.service';
import { ESCSItemStationController } from './item-station.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ESCSItemStation } from './entities/item-station.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ESCSItemStation], 'amecConnection')],
  controllers: [ESCSItemStationController],
  providers: [ESCSItemStationService],
  exports: [ESCSItemStationService],
})
export class ESCSItemStationModule {}
