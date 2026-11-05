import { Module } from '@nestjs/common';
import { WireHarnessCalculateUsageController } from './wire-harness-calculate-usage.controller';
import { WireHarnessCalculateUsageService } from './wire-harness-calculate-usage.service';
import { WireHarnessCalculateUsageRepository } from './wire-harness-calculate-usage.repository';

@Module({
    controllers: [
        WireHarnessCalculateUsageController,
    ],
    providers: [
        WireHarnessCalculateUsageService,
        WireHarnessCalculateUsageRepository,
    ],
})
export class WireHarnessCalculateUsageModule {}
