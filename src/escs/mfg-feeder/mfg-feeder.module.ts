import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MfgFeederController } from './mfg-feeder.controller';
import { MfgFeederService } from './mfg-feeder.service';
import { MfgFeederRepository } from './mfg-feeder.repository';

@Module({
    controllers: [
        MfgFeederController,
    ],
    providers: [
        MfgFeederService,
        MfgFeederRepository,
    ],
    exports: [
        MfgFeederService,
    ],
})
export class MfgFeederModule {}