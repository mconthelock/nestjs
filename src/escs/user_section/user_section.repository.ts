import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { USERS_SECTION } from 'src/common/Entities/escs/table/USERS_SECTION.entity';
import { SearchUsersSectionDto } from './dto/search-escs-usersection.dto';

@Injectable()
export class UsersSectionRepository extends BaseRepository {
    constructor(
        @InjectDataSource('escsConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    getUserSecAll() {
        return this.getRepository(USERS_SECTION).find({
            order: {
                SEC_ID: 'ASC',
            },
        });
    }

    getUserSecByID(id: number) {
        return this.getRepository(USERS_SECTION).findOne({
            where: { SEC_ID: id },
            order: {
                SEC_ID: 'ASC',
            },
        });
    }

    getSection(searchDto: SearchUsersSectionDto) {
        const { SEC_ID, SEC_NAME, SEC_STATUS, INCHARGE } = searchDto;
        return this.getRepository(USERS_SECTION).find({
            where: [{ SEC_ID, SEC_NAME, SEC_STATUS, INCHARGE }],
            order: {
                SEC_ID: 'ASC',
            },
        });
    }
}
