import { Injectable } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { WireHarnessAs400Repository } from './wire-harness-as400.repository';
import { WireHarnessRepository } from './wire-harness.repository';
import { CreateDrumDto } from './dto/create-drum.dto';

@Injectable()
export class WireHarnessService {
    constructor(
        private readonly as400: WireHarnessAs400Repository,
        private readonly repo: WireHarnessRepository,
    ) {}

    async syncProductionPlan() {
        const rows = await this.as400.getProductionPlan();
        const data = rows.map(row => ({
            CTRLNO: row.CTRLNO.trim(),
            PROCESS: row.PROCESS.trim(),
            PROD: row.PROD.trim(),
            P: row.P.trim(),
            SEQBM: Number(row.SEQBM),
            MFGNO: row.MFGNO.trim(),
            ITEMNO: row.ITEMNO.trim(),
            PACKNO: row.PACKNO.trim(),
            PROJ: row.PROJ.trim(),
            MODEL: row.MODEL.trim(),
            PARENT_DRAWING: row.PARENT_DRAWING.trim(),
            UPPER_DRAWING: row.UPPER_DRAWING.trim(),
            DRAWING: row.DRAWING.trim(),
            QTY: Number(row.QTY),
            MATERIAL: row.MATERIAL.trim(),
            ITEMCODE: row.ITEMCODE.trim(),
            CUT: Number(row.CUT),
            REMARK: row.REMARK.trim(),
        }));

        await this.repo.saveProductionPlan(data);
        return {
            total: data.length,
            message: 'Sync Production Plan Success',
        };
    }

    async process() {
        return this.repo.getProcess();
    }

    async production() {
        return this.repo.getProduction();
    }

    async autoPlan(condition: FiltersDto) {
        return this.repo.getAutoPlan(condition);
    }

    async drumStock(condition: FiltersDto) {
        return this.repo.getDrumStock(condition);
    }

    async createDrum(dto: CreateDrumDto) {
        return this.repo.createDrum(dto);
    }
}