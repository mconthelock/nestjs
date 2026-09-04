import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { COUNTRY_ORIGIN_BULK_LIST_VIEW } from 'src/common/Entities/workload/views/COUNTRY_ORIGIN_BULK_LIST_VIEW.entity';

@Injectable()
export class CountryOriginBulkListViewRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        return this.getRepository(COUNTRY_ORIGIN_BULK_LIST_VIEW).find({
            order: { PLANNER: 'ASC', BULK_CODE: 'ASC', DRAWING: 'ASC' },
        });
    }
}
