import { Module } from '@nestjs/common';
import { PsCihService } from './ps-cih.service';
import { PsCihController } from './ps-cih.controller';
import { PsCihRepository } from './ps-cih.repository';
import { PsCiRepository } from '../ps-ci/ps-ci.repository';
import { HandleFileFormModule } from 'src/webform/handle-file-form/handle-file-form.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INV_HALFYEAR_RESULT } from 'src/common/Entities/skid/table/INV_HALFYEAR_RESULT.entity';
import { PSCIH_FORM } from 'src/common/Entities/webform/table/PSCIH_FORM.entity';
import { INV_CHECK_LOG } from 'src/common/Entities/skid/table/PSINV_CHECK_LOG.entity';
import { MV_IMM_ITEMMST } from '../../../common/Entities/skid/table/MV_IMM_ITEMMST.entity';
import { INV_HALFYEAR_REPORT } from '../../../common/Entities/skid/table/INV_HALFYEAR_REPORT.entity';

@Module({
    controllers: [PsCihController],
    providers: [PsCihService, PsCihRepository, PsCiRepository],
    imports: [
        TypeOrmModule.forFeature([
        INV_HALFYEAR_RESULT,
        PSCIH_FORM,
        INV_CHECK_LOG,
        MV_IMM_ITEMMST,
        INV_HALFYEAR_REPORT,
    ], 'mitsuConnection'),HandleFileFormModule],
})
export class PsCihModule {}
