import { Module } from '@nestjs/common';

import { ExpatController } from './expat.controller';
import { ExpatService } from './expat.service';
import { ExpatRepository } from './expat.repository';

@Module({
    controllers: [
        ExpatController,
    ],
    providers: [
        ExpatService,
        ExpatRepository,
    ],
    exports: [
        ExpatService,
        ExpatRepository,
    ],
})
export class ExpatModule {}