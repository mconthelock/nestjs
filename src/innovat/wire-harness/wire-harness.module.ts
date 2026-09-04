import { Module } from '@nestjs/common';
import { ConectionModule } from 'src/as400/conection/conection.module';

import { WireHarnessController } from './wire-harness.controller';
import { WireHarnessService } from './wire-harness.service';
import { WireHarnessRepository } from './wire-harness.repository';

@Module({
    imports: [
        ConectionModule,
    ],
    controllers: [
        WireHarnessController,
    ],
    providers: [
        WireHarnessService,
        WireHarnessRepository,
    ],
})
export class WireHarnessModule {}