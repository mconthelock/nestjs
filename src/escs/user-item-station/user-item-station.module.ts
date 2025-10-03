import { Module } from '@nestjs/common';
import { ESCSUserItemStationService } from './user-item-station.service';
import { ESCSUserItemStationController } from './user-item-station.controller';

@Module({
  controllers: [ESCSUserItemStationController],
  providers: [ESCSUserItemStationService],
})
export class ESCSUserItemStationModule {}
