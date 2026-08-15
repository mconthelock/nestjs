import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { LVAPP } from 'src/common/Entities/webform/table/LVAPP.entity';
import { LR100P } from 'src/common/Entities/gpreport/table/LR100P.entity';

import { SearchLeaveDto } from './dto/search-leave.dto';
import { SearchActualLeaveDto } from './dto/lr100p.dto';

@Injectable()
export class LeaveService {
    constructor(
        @InjectRepository(LVAPP, 'gpreportConnection')
        private readonly lvapp: Repository<LVAPP>,

        @InjectRepository(LR100P, 'gpreportConnection')
        private readonly lr100: Repository<LR100P>,
    ) {}

    async search(q: SearchLeaveDto) {
        const qb = this.lvapp
            .createQueryBuilder('lvapp')
            .leftJoinAndSelect('lvapp.user', 'user')
            .leftJoinAndSelect('lvapp.form', 'form')
            .leftJoinAndSelect('form.flow', 'form_flow');
        await applyDynamicFilters(qb, q, 'lvapp');
        return qb.getMany();
    }

    async findActual(dto: SearchActualLeaveDto) {
        const qb = this.lr100.createQueryBuilder('lr100');
        await applyDynamicFilters(qb, dto, 'lr100');
        return qb.getMany();
    }
}
