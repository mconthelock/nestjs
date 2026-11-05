import { Injectable, BadRequestException } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { WireHarnessCuttingRepository } from './wire-harness-cutting.repository';
import { CreateDrumDto } from './dto/create-drum.dto';
import { UpdateDrumDto } from './dto/update-drum.dto';
import { DrumToStockDto } from './dto/drum-to-stock.dto';

@Injectable()
export class WireHarnessCuttingService {
    constructor(
        private readonly repo: WireHarnessCuttingRepository,
    ) {}

    async process() {
        return this.repo.getProcess();
    }

    async production() {
        return this.repo.getProduction();
    }

    async autoPlan(condition: FiltersDto) {
        return this.repo.getAutoPlan(condition);
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

    async reason(condition: FiltersDto) {
        return this.repo.reason(condition);
    }
}