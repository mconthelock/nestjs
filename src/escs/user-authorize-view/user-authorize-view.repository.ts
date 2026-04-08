import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { SearchUserAuthorizeViewDto } from './dto/search-user-authorize-view.dto';
import { USERS_AUTHORIZE_VIEW } from 'src/common/Entities/escs/views/USERS_AUTHORIZE_VIEW.entity';

@Injectable()
export class UsersAuthorizeViewRepository extends BaseRepository {
    constructor(
        @InjectDataSource('escsConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getUserAuthorizeView(dto: SearchUserAuthorizeViewDto) {
        return this.getRepository(USERS_AUTHORIZE_VIEW).find({
            where: dto,
            relations: {
                STATION: true,
            },
            order: {
                USR_NO: 'ASC',
                IT_NO: 'ASC',
                STATION_NO: 'ASC',
            },
        });
    }
}
