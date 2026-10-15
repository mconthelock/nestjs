import { Injectable } from '@nestjs/common';
import { CalculateUsageDto } from './dto/calculate-usage.dto';
import { WireHarnessCalculateUsageRepository } from './wire-harness-calculate-usage.repository';

@Injectable()
export class WireHarnessCalculateUsageService {
    constructor(
        private readonly repo: WireHarnessCalculateUsageRepository,
    ) {}

    list(dto: CalculateUsageDto) {
        return this.repo.list(dto);
    }
}