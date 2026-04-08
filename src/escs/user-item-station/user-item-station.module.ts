import { Module } from '@nestjs/common';
import { UsersItemStationService } from './user-item-station.service';
import { UsersItemStationController } from './user-item-station.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersItemStationRepository } from './user-item-station.repository';
import { USERS_ITEM_STATION } from 'src/common/Entities/escs/table/USERS_ITEM_STATION.entity';

@Module({
    imports: [TypeOrmModule.forFeature([USERS_ITEM_STATION], 'escsConnection')],
    controllers: [UsersItemStationController],
    providers: [UsersItemStationService, UsersItemStationRepository],
    exports: [UsersItemStationService],
})
export class UsersItemStationModule {}
