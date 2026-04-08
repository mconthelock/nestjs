import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { USERS_ITEM_STATION } from 'src/common/Entities/escs/table/USERS_ITEM_STATION.entity';
import { CreateUsersItemStationDto } from './dto/create-user-item-station.dto';

@Injectable()
export class UsersItemStationRepository extends BaseRepository {
    constructor(
        @InjectDataSource('escsConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async create(dto: CreateUsersItemStationDto) {
        return this.getRepository(USERS_ITEM_STATION).save(dto);
    }
}
