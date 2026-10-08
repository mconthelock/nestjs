import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DPMS_PL_MELT_LOG } from 'src/common/Entities/workload/table/DPMS_PL_MELT_LOG.entity';
import { CreateDpmsPlMeltLogDto } from './dto/create-dpms_pl_melt_log.dto';

@Injectable()
export class DpmsPlMeltLogRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    create(data: CreateDpmsPlMeltLogDto | CreateDpmsPlMeltLogDto[]) {
        if (Array.isArray(data)) {
            return this.getRepository(DPMS_PL_MELT_LOG).save(data);
        }
        return this.getRepository(DPMS_PL_MELT_LOG).save(data);
    }

    async getList(vanndate: string) {
        return this.getRepository(DPMS_PL_MELT_LOG).createQueryBuilder('log')
            .select('AMECLOAD, PROJECT, COUNT(*) AS TOTALSENT')
            .where("TRUNC(VANNDATE) = TO_DATE(:vanndate, 'YYYY-MM-DD')", { vanndate })
            .groupBy('AMECLOAD, PROJECT')
            .getRawMany();
    }
}
