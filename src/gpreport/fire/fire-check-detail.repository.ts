import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FireCheckDetail } from 'src/common/Entities/gpreport/table/FIRE_CHECK_DETAIL.entity';
import { FireCheckDetailKeyDto, FireCheckHeadKeyDto } from './dto/fire-check-key.dto';
import { SearchFireCheckDetailDto } from './dto/search-fire-check-detail.dto';

@Injectable()
export class FireCheckDetailRepository extends BaseRepository {
    constructor(@InjectDataSource('mitsuConnection') dataSource: DataSource) {
        super(dataSource);
    }

    hasCheckDetails(key: FireCheckHeadKeyDto) {
        return this.getRepository(FireCheckDetail).existsBy(key);
    }

    findCheckDetail(key: FireCheckDetailKeyDto) {
        return this.getRepository(FireCheckDetail).findOne({ where: key });
    }

    async searchCheckDetails(query: SearchFireCheckDetailDto) {
        const { page = 1, limit = 20, ...where } = query;
        const [data, total] = await this.getRepository(FireCheckDetail).findAndCount({
            where,
            order: {
                NFRMNO: 'ASC',
                VORGNO: 'ASC',
                CYEAR: 'ASC',
                CYEAR2: 'ASC',
                NRUNNO: 'ASC',
                ID: 'ASC',
                FIRE_CODE: 'ASC',
            },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    createCheckDetails(data: (Partial<FireCheckDetail> & FireCheckDetailKeyDto)[]) {
        return this.getRepository(FireCheckDetail).insert(data);
    }

    async createCheckDetail(data: Partial<FireCheckDetail> & FireCheckDetailKeyDto) {
        await this.getRepository(FireCheckDetail).insert(data);
        const { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO, ID, FIRE_CODE } = data;
        return this.findCheckDetail({ NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO, ID, FIRE_CODE });
    }

    updateCheckDetail(key: FireCheckDetailKeyDto, data: Partial<FireCheckDetail>) {
        return this.getRepository(FireCheckDetail).update(key, data);
    }

    deleteCheckDetail(key: FireCheckDetailKeyDto) {
        return this.getRepository(FireCheckDetail).delete(key);
    }
}
