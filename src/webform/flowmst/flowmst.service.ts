import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FLOWMST } from 'src/common/Entities/webform/table/FLOWMST.entity';
import { FlowmstRepository } from './flowmst.repository';

@Injectable()
export class FlowmstService {
    constructor(
        private readonly repo: FlowmstRepository,

        @InjectRepository(FLOWMST, 'webformConnection')
        protected readonly master: Repository<FLOWMST>,
    ) {}

    getFlowMasterAll() {
        return this.repo.findAll();
    }

    async getFlowMaster(NFRMNO: number, VORGNO: string, CYEAR: string) {
        return await this.repo.getFlowMaster(NFRMNO, VORGNO, CYEAR);
    }

    async findFlowMaster(NFRMNO: number, VORGNO: string, CYEAR: string) {
        return await this.master.find({
            where: {
                NFRMNO,
                VORGNO,
                CYEAR,
            },
            relations: ['STEPMST'],
        });
    }
}
