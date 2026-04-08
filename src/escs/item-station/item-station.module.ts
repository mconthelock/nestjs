import { Module } from '@nestjs/common';
import { ItemStationService } from './item-station.service';
import { ItemStationController } from './item-station.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ITEM_STATION } from 'src/common/Entities/escs/table/ITEM_STATION.entity';
import { ItemStationRepository } from './item-station.repository';

@Module({
    imports: [TypeOrmModule.forFeature([ITEM_STATION], 'escsConnection')],
    controllers: [ItemStationController],
    providers: [ItemStationService, ItemStationRepository],
    exports: [ItemStationService],
})
export class ItemStationModule {}
