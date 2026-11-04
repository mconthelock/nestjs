import { Module } from '@nestjs/common';
import { ConectionModule } from 'src/as400/conection/conection.module';
import { WireHarnessJobController } from './wire-harness-job.controller';
import { WireHarnessJobService } from './wire-harness-job.service';
import { WireHarnessJobRepository } from './wire-harness-job.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WHN_PRODUCTION_PLAN } from 'src/common/Entities/innovat/table/WHN_PRODUCTION_PLAN.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        WHN_PRODUCTION_PLAN,
    ], 'mitsuConnection'),ConectionModule],
    controllers: [WireHarnessJobController],
    providers: [WireHarnessJobService, WireHarnessJobRepository],
})
export class WireHarnessJobModule {}
