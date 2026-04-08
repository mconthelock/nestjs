import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { USERS_AUTHORIZE } from 'src/common/Entities/escs/table/USERS_AUTHORIZE.entity';

@Injectable()
export class UsersAuthorizeRepository extends BaseRepository {
    constructor(
        @InjectDataSource('escsConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async create(dto: any) {
        return this.getRepository(USERS_AUTHORIZE).save(dto);
    }
}
