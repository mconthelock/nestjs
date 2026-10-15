import { Injectable } from '@nestjs/common';
import { WireHarnessJobRepository } from './wire-harness-job.repository';

@Injectable()
export class WireHarnessJobService {
    constructor(
        private readonly repo: WireHarnessJobRepository,
    ) {}

    async syncProductionPlan() {
        const rows = await this.repo.getProductionPlan();
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
}