import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { CreateTurnoverunitDto } from './dto/create-turnoverunit.dto';
import { UpdateTurnoverunitDto } from './dto/update-turnoverunit.dto';
import { SearchTurnoverunitDto } from './dto/search-turnoverunit.dto';

import { Turnoverunit } from 'src/common/Entities/workload/table/TURNOVER_UNIT.entity';
@Injectable()
export class TurnoverunitService {
    constructor(
        @InjectRepository(Turnoverunit, 'workloadConnection')
        private readonly turnover: Repository<Turnoverunit>,
    ) {}

    async search(dto: SearchTurnoverunitDto): Promise<Turnoverunit[]> {
        const qb = this.turnover.createQueryBuilder('turnover');
        await applyDynamicFilters(qb, dto, 'turnover');
        return qb.getMany();
    }
}
