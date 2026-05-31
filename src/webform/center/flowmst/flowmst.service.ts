import { Injectable } from '@nestjs/common';
import { FlowmstRepository } from './flowmst.repository';

@Injectable()
export class FlowmstService {
    constructor(
        private readonly repo: FlowmstRepository,
    ) {}

    getFlowMasterAll() {
        return this.repo.findAll();
    }

    async getFlowMaster(NFRMNO: number, VORGNO: string, CYEAR: string) {
        return await this.repo.getFlowMaster(NFRMNO, VORGNO, CYEAR);
    }
}
