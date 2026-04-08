import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { USERS_FILES } from 'src/common/Entities/escs/table/USERS_FILES.entity';
import { UpdateUsersFileDto } from './dto/update-user-file.dto';

@Injectable()
export class UsersFileRepository extends BaseRepository {
    constructor(
        @InjectDataSource('escsConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async insert(dto: any) {
        return this.manager.insert(USERS_FILES, dto);
    }

    async newId(dto: UpdateUsersFileDto): Promise<number> {
        const result = await this.manager
            .getRepository(USERS_FILES)
            .createQueryBuilder()
            .select('MAX(UF_ID)', 'max')
            .where('UF_USR_NO = :user', { user: dto.UF_USR_NO })
            .andWhere('UF_ITEM = :item', { item: dto.UF_ITEM })
            .andWhere('UF_STATION = :station', { station: dto.UF_STATION })
            .getRawOne();
        return result.max + 1;
    }
}
