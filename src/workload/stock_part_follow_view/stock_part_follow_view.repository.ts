import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { STOCK_PART_FOLLOW_VIEW } from 'src/common/Entities/workload/views/STOCK_PART_FOLLOW_VIEW.entity';

@Injectable()
export class StockPartFollowViewRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        return this.getRepository(STOCK_PART_FOLLOW_VIEW).find({
            order: {
                ITEM: 'ASC',
                DRAWING: 'ASC',
                PROD: 'ASC',
                IDTAG: 'ASC',
                PROCESS: 'ASC',
            },
        });
    }
}
