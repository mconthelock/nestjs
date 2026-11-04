import { Module } from '@nestjs/common';
import { WireHarnessCalculateUsageController } from './wire-harness-calculate-usage.controller';
import { WireHarnessCalculateUsageService } from './wire-harness-calculate-usage.service';
import { WireHarnessCalculateUsageRepository } from './wire-harness-calculate-usage.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WHN_AUTOPLAN } from 'src/common/Entities/innovat/views/WHN_AUTOPLAN.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        WHN_AUTOPLAN,
    ], 'mitsuConnection'),
    ],
    controllers: [WireHarnessCalculateUsageController],
    providers: [WireHarnessCalculateUsageService, WireHarnessCalculateUsageRepository],
})
export class WireHarnessCalculateUsageModule {}
