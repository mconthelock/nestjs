import { Module } from '@nestjs/common';
import { PurvmmFormService } from './purvmm_form.service';
import { PurvmmFormController } from './purvmm_form.controller';
import { PurvmmFormRepository } from './purvmm_form.repository';

@Module({
    controllers: [PurvmmFormController],
    providers: [PurvmmFormService, PurvmmFormRepository],
})
export class PurvmmFormModule {}
