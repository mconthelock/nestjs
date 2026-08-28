import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Like, Not } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { CreateUNAFormDto } from './dto/create-una-form.dto';

import { AnnualUniform } from 'src/common/Entities/gpreport/table/UNIFORM_ANNUAL.entity';
import { AnnualUniformDetail } from 'src/common/Entities/gpreport/table/UNIFORM_ANNUAL_DETAIL.entity';

@Injectable()
export class AnnualUniformRepository extends BaseRepository {
    constructor(@InjectDataSource('gpreportConnection') ds: DataSource) {
        super(ds);
    }

    async search(userId: string, year: number) {
        return this.manager
            .createQueryBuilder(AnnualUniform, 'annual')
            .leftJoinAndSelect('annual.details', 'details')
            .where('annual.REQ_USER = :userId', { userId })
            .andWhere('annual.REQ_YEAR = :year', { year })
            .getMany();
    }

    async create(
        header: Partial<AnnualUniform>,
        details: Partial<AnnualUniformDetail>[] = [],
    ) {
        const annual = await this.getRepository(AnnualUniform).save(header);

        for (const item of details || []) {
            await this.getRepository(AnnualUniformDetail).save({
                ...item,
                REQL_YEAR: annual.REQ_YEAR,
                REQL_USER: annual.REQ_USER,
            });
        }
    }

    async delete(userId: string, year: number) {
        await this.getRepository(AnnualUniformDetail).delete({
            REQL_USER: userId,
            REQL_YEAR: year,
        });
        await this.getRepository(AnnualUniform).delete({
            REQ_USER: userId,
            REQ_YEAR: year,
        });
        return { status: true, message: 'Annual request deleted successfully' };
    }

    async createForm(data: CreateUNAFormDto) {}
}
