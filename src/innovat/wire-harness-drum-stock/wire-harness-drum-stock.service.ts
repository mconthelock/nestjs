import { Injectable } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { ScrapDrumDto } from './dto/scrap-drum.dto';
import { WireHarnessDrumStockRepository } from './wire-harness-drum-stock.repository';

@Injectable()
export class WireHarnessDrumStockService {
    constructor(
        private readonly repo: WireHarnessDrumStockRepository,
    ) {}

    list(condition: FiltersDto) {
        return this.repo.list(condition);
    }

    scrapDrum(dto: ScrapDrumDto) {
        return this.repo.scrapDrum(dto);
    }
}