import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ITEM } from 'src/common/Entities/escs/table/ITEM.entity';
import { SearchItemDto } from './dto/search-escs-item.dto';

@Injectable()
export class ItemRepository extends BaseRepository {
    constructor(
        @InjectDataSource('escsConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    getItemAll() {
        return this.getRepository(ITEM).find({
            order: {
                IT_NO: 'ASC',
            },
        });
    }

    getItemByItem(item: string) {
        return this.getRepository(ITEM).findOne({
            where: { IT_NO: item },
            order: {
                IT_NO: 'ASC',
            },
        });
    }

    getItem(searchDto: SearchItemDto) {
        const {
            IT_NO,
            IT_USERUPDATE,
            IT_STATUS,
            SEC_ID,
            IT_QCDATE,
            IT_MFGDATE,
        } = searchDto;
        return this.getRepository(ITEM).find({
            where: [
                {
                    IT_NO,
                    IT_USERUPDATE,
                    IT_STATUS,
                    SEC_ID,
                    IT_QCDATE,
                    IT_MFGDATE,
                },
            ],
            order: {
                IT_NO: 'ASC',
            },
        });
    }
}
