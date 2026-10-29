import { Injectable } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { DrumMasterDto } from './dto/drum-master.dto';
import { WireHarnessDrumMasterRepository } from './wire-harness-drum-master.repository';

@Injectable()
export class WireHarnessDrumMasterService {
    constructor(
        private readonly repo: WireHarnessDrumMasterRepository,
    ) {}

    list(condition: FiltersDto) {
        return this.repo.list(condition);
    }

    save(dto: DrumMasterDto[]) {
        return this.repo.save(dto);
    }
}