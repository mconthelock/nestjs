import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { STY_ITEMS } from 'src/common/Entities/gpreport/table/STY_ITEMS.entity';

@Injectable()
export class StyItemsRepository extends BaseRepository {
    constructor(@InjectDataSource('gpreportConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    getItemByTypecode(typecode: string) {
        return this.manager.find(STY_ITEMS, {
            where: {
                STY_TYPE: {
                    TYPE_CODE: typecode,
                },
            },
            relations: {
                STY_TYPE: true,
            },
            order: {
                ITEMS_ID: 'ASC',
            },
        });
    }
}
