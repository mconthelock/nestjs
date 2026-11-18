import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurvmmFormService } from './purvmm_form.service';
import { PurvmmFormController } from './purvmm_form.controller';
import { PurvmmFormRepository } from './purvmm_form.repository';
import { PURVMM_FORM } from 'src/common/Entities/webform/table/PURVMM_FORM.entity';
import { PURVMM_SCMUSR } from 'src/common/Entities/webform/table/PURVMM_SCMUSR.entity';
import { TermTrade } from 'src/common/Entities/pursys/table/TERM_TRADE.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PURVMM_FORM, PURVMM_SCMUSR, TermTrade], 'mitsuConnection')],
    controllers: [PurvmmFormController],
    providers: [PurvmmFormService, PurvmmFormRepository],
})
export class PurvmmFormModule {}
