import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { IsWorkLoad } from 'src/common/Entities/docinv/table/allwork.entity';
import { IsWorkStatus } from 'src/common/Entities/docinv/table/workstatus.entity';
import { SearchWorkloadDto } from './dto/search.dto';

@Injectable()
export class IsWorkloadService {
    constructor(
        @InjectRepository(IsWorkLoad, 'mitsuConnection')
        private readonly works: Repository<IsWorkLoad>,

        @InjectRepository(IsWorkStatus, 'mitsuConnection')
        private readonly status: Repository<IsWorkStatus>,
    ) {}

    async searchWorkload(searchDto: SearchWorkloadDto) {
        return this.works.find({ where: { PLANYEAR: searchDto.PLANYEAR } });
    }

    async listStatus() {
        return this.status.find();
    }
}
