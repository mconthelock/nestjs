import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';
import { CreateBlockmasterDto } from './dto/create-blockmaster.dto';
import { UpdateBlockmasterDto } from './dto/update-blockmaster.dto';

import { BlockMaster } from '../../common/Entities/workload/table/APM_MASTER.entity';

@Injectable()
export class BlockmasterService {
    constructor(
        @InjectRepository(BlockMaster, 'workloadConnection')
        private readonly block: Repository<BlockMaster>,
    ) {}

    async findAll() {
        return this.block.find({ relations: ['stations'] });
    }
}
