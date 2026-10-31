import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { STOCK_PART_FOLLOW } from 'src/common/Entities/workload/table/STOCK_PART_FOLLOW.entity';

@Injectable()
export class StockPartFollowRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    create(data: STOCK_PART_FOLLOW) {
        return this.getRepository(STOCK_PART_FOLLOW).save({
            ...data,
            PLAN: data.PLAN ? data.PLAN : null,
        });
    }
}
