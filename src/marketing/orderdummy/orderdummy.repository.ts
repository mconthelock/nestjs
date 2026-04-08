import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { TMARKET_TEMP_DUMMY } from 'src/common/Entities/datacenter/table/TMARKET_TEMP_DUMMY.entity';
import { TMARKET_TEMP } from 'src/common/Entities/datacenter/table/TMARKET_TEMP.entity';

@Injectable()
export class OrderdummyRepository extends BaseRepository {
    constructor(
        @InjectDataSource('datacenterConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(TMARKET_TEMP_DUMMY, 'T');
        this.applyFilters(qb, 'T', dto, [
            'SERIES',
            'AGENT',
            'PRJ_NO',
            'ORDER_NO',
            'MFGNO',
            'CAR_NO',
        ]);
        return qb.getMany();
    }

    async getOrderMain(order: string, item: string) {
        return this.manager
            .createQueryBuilder(TMARKET_TEMP_DUMMY, 'D')
            .select(['M.MFGNO AS MFGMAIN'])
            .innerJoin(
                TMARKET_TEMP,
                'M',
                "D.NORMAL_CAR_NO=TRIM(M.CAR_NO) AND D.NORMAL_ORDER_NO=TRIM(M.ORDER_NO) AND M.REVISION_CODE!='D'",
            )
            .where('D.MFGNO = :order', { order })
            .andWhere('D.ITEM_ORDER like :item', { item: `%${item}%` })
            .getRawMany();
    }
}
