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

    findAll(){
        return this.getRepository(DPMS_PACKING_LIST).find({
            // where : {
            //     PL_PLAN : MoreThan(new Date('2026-01-01'))
            // },
            order : {
                DELAY: 'DESC',
                PROD: 'ASC',
                P: 'ASC',
                ORDERS: 'ASC',
            }
        });
    }
}
