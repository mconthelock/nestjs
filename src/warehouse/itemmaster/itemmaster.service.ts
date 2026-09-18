import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';
import { IMM_ITEMMST } from 'src/common/Entities/skid/views/IMM_ITEMMST.entity';
import { PART_SHORTAGE_CONTROL } from 'src/common/Entities/skid/table/PART_SHORTAGE_CONTROL.entity';

import { CreateItemmasterDto } from './dto/create-itemmaster.dto';
import { UpdateItemmasterDto } from './dto/update-itemmaster.dto';
import { SearchItemmasterDto } from './dto/search-itemmaster.dto';
@Injectable()
export class ItemmasterService {
    constructor(
        @InjectRepository(IMM_ITEMMST, 'webformConnection')
        private readonly itm: Repository<IMM_ITEMMST>,
        @InjectRepository(PART_SHORTAGE_CONTROL, 'webformConnection')
        private readonly psc: Repository<PART_SHORTAGE_CONTROL>,
    ) {}

    async findAll(dto: SearchItemmasterDto) {
        // return this.itm.find();
        const qb = this.itm.createQueryBuilder('itm');
        await applyDynamicFilters(qb, dto, 'itm');
        return qb.getMany();
    }

    async hideShortage(dto) {
        try {
            if (dto.HIDE_SHORTAGE == '1') {
                return this.psc.save(dto);
            } else if (dto.HIDE_SHORTAGE == '0') {
                return this.psc.delete({ CODE: dto.CODE });
            }
        } catch (error) {
            return error;
        }
    }
}
