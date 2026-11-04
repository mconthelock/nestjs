import { Module } from '@nestjs/common';
import { PurvmmScmusrService } from './purvmm_scmusr.service';
import { PurvmmScmusrController } from './purvmm_scmusr.controller';
import { PurvmmScmuserRepository } from './purvmm_scmusr.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PURVMM_SCMUSR } from 'src/common/Entities/webform/table/PURVMM_SCMUSR.entity';
import { PURVMM_FORM } from '../../../../common/Entities/webform/table/PURVMM_FORM.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        PURVMM_SCMUSR,
        PURVMM_FORM,
    ], 'mitsuConnection'),
    ],
    controllers: [PurvmmScmusrController],
    providers: [PurvmmScmusrService, PurvmmScmuserRepository],
})
export class PurvmmScmusrModule {}
