import { Module } from '@nestjs/common';
import { ESCSUserItemStationService } from './user-item-station.service';
import { ESCSUserItemStationController } from './user-item-station.controller';
import { ESCSUserItemStation } from './entities/user-item-station.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ESCSUserItemStation], 'escsConnection')],
  controllers: [ESCSUserItemStationController],
  providers: [ESCSUserItemStationService],
  exports: [ESCSUserItemStationService],
})
export class ESCSUserItemStationModule {}
