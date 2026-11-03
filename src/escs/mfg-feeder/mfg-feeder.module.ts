import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MfgFeederController } from './mfg-feeder.controller';
import { MfgFeederService } from './mfg-feeder.service';
import { MfgFeederRepository } from './mfg-feeder.repository';
import { F001KP } from 'src/common/Entities/escs/table/F001KP.entity';
import { Q90010P2 } from 'src/common/Entities/escs/table/Q90010P2.entity';
import { M008KP } from 'src/common/Entities/escs/table/M008KP.entity';
import { AMECORDERS_PROCESS } from 'src/common/Entities/escs/table/AMECORDERS_PROCESS.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [F001KP, Q90010P2, M008KP, AMECORDERS_PROCESS],
            'mitsuConnection',
        ),
    ],
    controllers: [MfgFeederController],
    providers: [MfgFeederService, MfgFeederRepository],
    exports: [MfgFeederService],
})
export class MfgFeederModule {}
