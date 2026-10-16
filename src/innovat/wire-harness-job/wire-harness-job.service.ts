<<<<<<< HEAD:src/innovat/wire-harness-job/wire-harness-job.service.ts
import { Injectable } from '@nestjs/common';
import { WireHarnessJobRepository } from './wire-harness-job.repository';
=======
import { Injectable, BadRequestException } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { WireHarnessAs400Repository } from './wire-harness-as400.repository';
import { WireHarnessRepository } from './wire-harness.repository';
import { CreateDrumDto } from './dto/create-drum.dto';
import { UpdateDrumDto } from './dto/update-drum.dto';
import { DrumToStockDto } from './dto/drum-to-stock.dto';
>>>>>>> 9119de43 (wire-harness):src/innovat/wire-harness/wire-harness.service.ts

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
<<<<<<< HEAD:src/innovat/wire-harness-job/wire-harness-job.service.ts
=======

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
        try {
            return await this.repo.createDrum(dto);
        } catch (error) {
            const message = error.message.split('\n')[0].replace(/^ORA-\d+:\s*/, '');
            throw new BadRequestException(message);
        }
    }

    async updateDrum(dto: UpdateDrumDto) {
        try {
            return await this.repo.updateDrum(dto);
        } catch (error) {
            const message = error.message.split('\n')[0].replace(/^ORA-\d+:\s*/, '');
            throw new BadRequestException(message);
        }
    }

    async drumToStock(dto: DrumToStockDto) {
        return this.repo.drumToStock(dto);
    }
<<<<<<< HEAD:src/innovat/wire-harness-job/wire-harness-job.service.ts
>>>>>>> 9119de43 (wire-harness):src/innovat/wire-harness/wire-harness.service.ts
=======

    async drumMaster(condition: FiltersDto) {
        return this.repo.getDrumMaster(condition);
    }
<<<<<<< HEAD:src/innovat/wire-harness-job/wire-harness-job.service.ts
>>>>>>> 640b6378 (wire-harness):src/innovat/wire-harness/wire-harness.service.ts
=======

    async reason(condition: FiltersDto) {
        return this.repo.reason(condition);
    }
>>>>>>> ea37e1b8 (wire harness):src/innovat/wire-harness/wire-harness.service.ts
}