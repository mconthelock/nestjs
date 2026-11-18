import { Module } from '@nestjs/common';
import { PsCiService } from './ps-ci.service';
import { PsCiController } from './ps-ci.controller';
import { PsCiRepository } from './ps-ci.repository';
import { HandleFileFormModule } from 'src/webform/handle-file-form/handle-file-form.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INV_CHECK_LOG } from 'src/common/Entities/skid/table/PSINV_CHECK_LOG.entity';
import { INV_CHECK_RESULT } from 'src/common/Entities/skid/table/INV_CHECK_RESULT.entity';
import { INV_HALFYEAR_RESULT } from '../../../common/Entities/skid/table/INV_HALFYEAR_RESULT.entity';

@Module({
    controllers: [PsCiController],
    providers: [PsCiService, PsCiRepository],
    imports: [
        TypeOrmModule.forFeature([
        INV_CHECK_LOG,
        INV_CHECK_RESULT,
        INV_HALFYEAR_RESULT,
    ], 'mitsuConnection'),HandleFileFormModule],
})
export class PsCiModule {}
