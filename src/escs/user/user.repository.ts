import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { USERS } from 'src/common/Entities/escs/table/USERS.entity';
import { AMECUSERALL } from 'src/common/Entities/amec/views/AMECUSERALL.entity';
import { SearchUsersDto } from './dto/search-escs-user.dto';
import { getSafeFields } from 'src/common/utils/Fields.utils';
import { CreateUsersDto } from './dto/create-escs-user.dto';

@Injectable()
export class UsersRepository extends BaseRepository {
    constructor(
        @InjectDataSource('escsConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }
    private escs = this.manager
        .getRepository(USERS)
        .metadata.columns.map((c) => c.propertyName);
    private user = this.manager
        .getRepository(AMECUSERALL)
        .metadata.columns.map((c) => c.propertyName);
    private allowFields = [...this.escs, ...this.user];

    getUserAll() {
        return this.getRepository(USERS).find({
            order: {
                USR_ID: 'ASC',
            },
        });
    }

    getUserByID(id: number) {
        return this.getRepository(USERS).findOne({
            where: { USR_ID: id },
            order: {
                USR_ID: 'ASC',
            },
        });
    }

    getUser(searchDto: SearchUsersDto) {
        const {
            USR_ID,
            USR_NO,
            GRP_ID,
            USR_STATUS,
            SEC_ID,
            fields = [],
        } = searchDto;
        const query = this.manager.createQueryBuilder().from('USERS', 'A');

        if (USR_ID) query.andWhere('A.USR_ID = :USR_ID', { USR_ID });
        if (USR_NO) query.andWhere('A.USR_NO = :USR_NO', { USR_NO });
        if (GRP_ID) query.andWhere('A.GRP_ID = :GRP_ID', { GRP_ID });
        if (USR_STATUS)
            query.andWhere('A.USR_STATUS = :USR_STATUS', { USR_STATUS });
        if (SEC_ID) query.andWhere('A.SEC_ID = :SEC_ID', { SEC_ID });

        let select = [];
        if (fields.length > 0) {
            select = getSafeFields(fields, this.allowFields);
        } else {
            select = this.allowFields;
        }

        select.forEach((f) => {
            if (this.user.includes(f)) {
                query.addSelect(`B.${f}`, f);
            } else {
                query.addSelect(`A.${f}`, f);
            }
        });
        query.leftJoin('AMECUSERALL', 'B', 'A.USR_NO = B.SEMPNO');
        query.andWhere('B.CSTATUS = 1');
        query.orderBy('A.USR_NO', 'ASC');
        return query.getRawMany();
    }

    async insertUser(dto: CreateUsersDto) {
        return await this.getRepository(USERS).insert(dto);
    }
}
