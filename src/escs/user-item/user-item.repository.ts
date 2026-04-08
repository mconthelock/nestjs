import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { CreateUserItemDto } from './dto/create-user-item.dto';
import { UpdateUserItemDto } from './dto/update-user-item.dto';
import { USERS_ITEM } from 'src/common/Entities/escs/table/USERS_ITEM.entity';

@Injectable()
export class UserItemRepository extends BaseRepository {
    constructor(
        @InjectDataSource('escsConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from USERS_ITEM`);
        // return this.getRepository(USERS_ITEM).find();
        return this.manager.find(USERS_ITEM);
    }

    findOne(usrNo: string, itemNo: string) {
        return this.getRepository(USERS_ITEM).findOneBy({
            USR_NO: usrNo,
            IT_NO: itemNo,
        });
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(USERS_ITEM, 'U');
        this.applyFilters(qb, 'U', dto, ['USR_NO', 'IT_NO']);
        return qb.orderBy('U.USR_NO, U.IT_NO', 'ASC').getMany();
    }

    async create(dto: CreateUserItemDto) {
        return this.getRepository(USERS_ITEM).save(dto);
    }

    async update(
        condition: { USR_NO: string; IT_NO: string },
        dto: UpdateUserItemDto,
    ) {
        return this.getRepository(USERS_ITEM).update(condition, dto);
    }

    async remove(condition: { USR_NO: string; IT_NO: string }) {
        return this.getRepository(USERS_ITEM).delete(condition);
    }
}
