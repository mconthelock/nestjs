import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { AmecOrdersSchedule } from 'src/common/Entities/workload/table/amecorders_schedule.entity';

@Injectable()
export class AmecordersScheduleRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    getMfgbmRange(jung: string) {
        return this.getRepository(AmecOrdersSchedule)
            .createQueryBuilder('A')
            .select(
                'MIN(MFGBM_NO) AS NSTART, MAX(MFGBM_NO) AS NEND, F_CPROD(MIN(MFGBM_NO)) AS VSTART, F_CPROD(MAX(MFGBM_NO)) AS VEND ',
            )
            .where('MFGBM LIKE :jung AND MFGBM_ACTUAL IS NOT NULL', {
                jung: `${jung}%`,
            })
            .getRawOne();
    }
}
