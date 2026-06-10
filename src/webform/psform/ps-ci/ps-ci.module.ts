import { Module } from '@nestjs/common';
import { PsCiService } from './ps-ci.service';
import { PsCiController } from './ps-ci.controller';
import { PsCiRepository } from './ps-ci.repository';
import { HandleFileFormModule } from 'src/webform/handle-file-form/handle-file-form.module';

@Module({
    controllers: [PsCiController],
    providers: [PsCiService, PsCiRepository],
    imports:[HandleFileFormModule]
})
export class PsCiModule {}
