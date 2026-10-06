import { Module } from '@nestjs/common';
import { PurvmmScmusrService } from './purvmm_scmusr.service';
import { PurvmmScmusrController } from './purvmm_scmusr.controller';
import { PurvmmScmuserRepository } from './purvmm_scmusr.repository';

@Module({
    controllers: [PurvmmScmusrController],
    providers: [PurvmmScmusrService, PurvmmScmuserRepository],
})
export class PurvmmScmusrModule {}
