import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DPMS_PACKING_LIST } from 'src/common/Entities/workload/views/DPMS_PACKING_LIST.entity';
import { searchDpmsPackingListDto } from './dto/search_dpms_packing_list.dto';

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

    search(condition: searchDpmsPackingListDto) {
        const { TYPE, DFINISHALL, FINISH_DATE, PL_PLAN, ...cond } = condition;
        const query = this.manager
            .createQueryBuilder(DPMS_PACKING_LIST, 'L')
            .where(cond);
        if(TYPE == 'MAIN'){
            query.andWhere('L.TYPE IN (:...TYPES)', { TYPES: ['ELE', 'ESC'] });
        }else if(TYPE){
            query.andWhere('L.TYPE = :TYPE', { TYPE });
        }
        if (PL_PLAN) {
            query.andWhere('TRUNC(L.PL_PLAN) = TRUNC(TO_DATE(:PL_PLAN, \'YYYY-MM-DD\'))', { PL_PLAN });
        }
        if (FINISH_DATE) {
            query.andWhere('TRUNC(L.DFINISHALL) = TRUNC(TO_DATE(:FINISH_DATE, \'YYYY-MM-DD\'))', {
                FINISH_DATE,
            });
        }
        if (DFINISHALL == 'Y') {
            query.andWhere('L.DFINISHALL IS NOT NULL');
        }else if (DFINISHALL == 'N') {
            query.andWhere('L.DFINISHALL IS NULL');
        }
        return query
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
