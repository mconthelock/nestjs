import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { UpdateItemStationDto } from './dto/update-item-station.dto';
import { ITEM_STATION } from 'src/common/Entities/escs/table/ITEM_STATION.entity';

@Injectable()
export class ItemStationRepository extends BaseRepository {
    constructor(
        @InjectDataSource('escsConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }
    async searchItemStation(dto: UpdateItemStationDto) {
        return this.getRepository(ITEM_STATION).find({
            where: dto,
            order: {
                ITS_NO: 'ASC',
            },
        });
    }
}
