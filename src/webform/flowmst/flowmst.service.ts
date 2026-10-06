import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FLOWMST } from 'src/common/Entities/webform/table/FLOWMST.entity';
import { FlowmstRepository } from './flowmst.repository';
import { UpdateFlowmstDto } from './dto/update-flowmst.dto';
import { CreateFlowmstDto } from './dto/create-flowmst.dto';

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

    async createFlowMaster(data: CreateFlowmstDto) {
        const flowMaster = this.master.create(data);
        return await this.master.save(flowMaster);
    }

    async updateFlowMaster(data: UpdateFlowmstDto) {
        await this.master.update(
            { NFRMNO: data.NFRMNO, VORGNO: data.VORGNO, CYEAR: data.CYEAR },
            data,
        );
        return await this.getFlowMaster(data.NFRMNO, data.VORGNO, data.CYEAR);
    }

    async deleteFlowMaster(NFRMNO: number, VORGNO: string, CYEAR: string) {
        return await this.master.delete({ NFRMNO, VORGNO, CYEAR });
    }
}
