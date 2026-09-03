import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';
import { IMM_ITEMMST } from 'src/common/Entities/skid/views/IMM_ITEMMST.entity';

import { CreateItemmasterDto } from './dto/create-itemmaster.dto';
import { UpdateItemmasterDto } from './dto/update-itemmaster.dto';
import { SearchItemmasterDto } from './dto/search-itemmaster.dto';
@Injectable()
export class ItemmasterService {
    constructor(
        @InjectRepository(IMM_ITEMMST, 'webformConnection')
        private readonly itm: Repository<IMM_ITEMMST>,
    ) {}

    async findAll(dto: SearchItemmasterDto) {
        // return this.itm.find();
        const qb = this.itm.createQueryBuilder('itm');
        await applyDynamicFilters(qb, dto, 'itm');
        return qb.getMany();
    }
}
