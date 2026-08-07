import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { CreateProblemMasterDto } from './dto/create-problem_master.dto';
import { UpdateProblemMasterDto } from './dto/update-problem_master.dto';
import { SearchProblemMasterDto } from './dto/search-problem_master.dto';

import { Problemaster } from 'src/common/Entities/workload/table/DPMS_PROBLEM_MASTER.entity';
@Injectable()
export class ProblemMasterService {
    constructor(
        @InjectRepository(Problemaster, 'workloadConnection')
        private readonly prb: Repository<Problemaster>,
    ) {}

    async search(dto: SearchProblemMasterDto) {
        const qb = this.prb.createQueryBuilder('prb');
        await applyDynamicFilters(qb, dto, 'prb');
        return qb.getMany();
    }
}
