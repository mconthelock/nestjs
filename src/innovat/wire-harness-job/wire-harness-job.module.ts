import { Module } from '@nestjs/common';
import { ConectionModule } from 'src/as400/conection/conection.module';
import { WireHarnessJobController } from './wire-harness-job.controller';
import { WireHarnessJobService } from './wire-harness-job.service';
import { WireHarnessJobRepository } from './wire-harness-job.repository';

@Module({
    imports: [
        ConectionModule,
    ],
    controllers: [
        WireHarnessJobController,
    ],
    providers: [
        WireHarnessJobService,
        WireHarnessJobRepository,
    ],
})
export class WireHarnessJobModule {}