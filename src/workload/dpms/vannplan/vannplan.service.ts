import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { CreateVannplanDto } from './dto/create-vannplan.dto';
import { UpdateVannplanDto } from './dto/update-vannplan.dto';
import { SearchVannplanDto } from './dto/search-vannplan.dto';

import { Vannplan } from 'src/common/Entities/workload/views/VANNPLAN.entity';

@Injectable()
export class VannplanService {
    constructor(
        @InjectRepository(Vannplan, 'workloadConnection')
        private readonly vann: Repository<Vannplan>,
    ) {}

    async search(dto: SearchVannplanDto) {
        const qb = this.vann.createQueryBuilder('vann');
        await applyDynamicFilters(qb, dto, 'vann');
        return qb.getMany();
    }
}
