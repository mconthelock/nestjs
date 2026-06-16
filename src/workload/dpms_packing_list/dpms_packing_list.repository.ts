import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, MoreThan } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DPMS_PACKING_LIST } from 'src/common/Entities/workload/views/DPMS_PACKING_LIST.entity';

@Injectable()
export class DpmsPackingListRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        return this.getRepository(DPMS_PACKING_LIST).find({
            // where : {
            //     PL_PLAN : MoreThan(new Date('2026-01-01'))
            // },
            order: {
                REVISE: 'DESC',
                DELAY: 'DESC',
                PROD: 'ASC',
                P: 'ASC',
                ORDERS: 'ASC',
            },
        });
    }

    getCurrentTasks() {
        return this.manager
            .createQueryBuilder(DPMS_PACKING_LIST, 'L')
            .where(
                '(TRUNC(L.DFINISHALL) >= TRUNC(SYSDATE) OR L.DFINISHALL IS NULL)',
            )
            .orderBy({
                'L.REVISE': 'DESC',
                'L.DELAY': 'DESC',
                'L.PROD': 'ASC',
                'L.P': 'ASC',
                'L.ORDERS': 'ASC',
            })
            .getMany();
    }

    getFinishTasks() {
        return this.manager
            .createQueryBuilder(DPMS_PACKING_LIST, 'L')
            .where('L.DFINISHALL IS NOT NULL')
            .orderBy({
                'L.REVISE': 'DESC',
                'L.DELAY': 'DESC',
                'L.PROD': 'ASC',
                'L.P': 'ASC',
                'L.ORDERS': 'ASC',
            })
            .getMany();
    }
}
