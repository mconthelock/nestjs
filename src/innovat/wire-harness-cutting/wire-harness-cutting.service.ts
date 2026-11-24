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

    private getErrorMessage(error: Error) {
        return error.message.match(/ORA-20\d{3}:\s*(.*)/)?.[1] || error.message;
    }

    async processGroup(ip: string) {
        return this.repo.getGroup(ip);
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
            throw new BadRequestException(this.getErrorMessage(error));
        }
    }

    async updateDrum(dto: UpdateDrumDto) {
        try {
            return await this.repo.updateDrum(dto);
        } catch (error) {
            throw new BadRequestException(this.getErrorMessage(error));
        }
    }

    async drumToStock(dto: DrumToStockDto) {
        try {
            return await this.repo.drumToStock(dto);
        } catch (error) {
            throw new BadRequestException(this.getErrorMessage(error));
        }
    }

    async reason(condition: FiltersDto) {
        return this.repo.reason(condition);
    }
}