import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { Diligent } from 'src/common/Entities/gpreport/views/DILIGENT.entity';

import { SearchDiligentDto } from './dto/search-diligent.dto';

@Injectable()
export class DiligentService {
    constructor(
        @InjectRepository(Diligent, 'gpreportConnection')
        private readonly diligent: Repository<Diligent>,
    ) {}
    async search(dto: SearchDiligentDto) {
        const query = this.diligent.createQueryBuilder('diligent');
        await applyDynamicFilters(query, dto, 'diligent');
        return query.getMany();
    }

    findOne(id: string) {
        return this.diligent.find({ where: { EMPCOD: id } });
    }
}
