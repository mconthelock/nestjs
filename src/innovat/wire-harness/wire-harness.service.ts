import { Injectable } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { WireHarnessAs400Repository } from './wire-harness-as400.repository';
import { WireHarnessRepository } from './wire-harness.repository';

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
            PROJ: row.PROJ.trim(),
            MODEL: row.MODEL.trim(),
            DWG: row.DWG.trim(),
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

    async item() {
        const data = await this.repo.getItem();
        return data.map(item => ({
            INFO: `${item.ITEM_NO.substring(0, 3)}-${item.ITEM_NO.substring(3)}`,
            VALUE: item.ITEM_NO,
            PROCESS: item.ITEM_PROCESS,
        }));
    }

    async production() {
        return this.repo.getProduction();
    }

    async autoPlan(condition: FiltersDto) {
        return this.repo.getAutoPlan(condition);
    }
}