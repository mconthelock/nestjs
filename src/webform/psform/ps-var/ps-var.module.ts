import { Module } from '@nestjs/common';
import { PsVarService } from './ps-var.service';
import { PsVarController } from './ps-var.controller';
import { FormModule } from 'src/webform/form/form.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { PsVarRepository } from './ps-var.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INV_CHECK_ASSIGN } from 'src/common/Entities/skid/table/INV_CHECK_ASSIGN.entity';
import { INV_HALFYEAR_RESULT } from 'src/common/Entities/skid/table/INV_HALFYEAR_RESULT.entity';
import { PSVAR_FORM } from 'src/common/Entities/webform/table/PSVAR_FORM.entity';
import { PSCIH_FORM } from '../../../common/Entities/webform/table/PSCIH_FORM.entity';
import { MV_IMM_ITEMMST } from '../../../common/Entities/skid/table/MV_IMM_ITEMMST.entity';
import { INV_CHECK_LOG } from '../../../common/Entities/skid/table/PSINV_CHECK_LOG.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        INV_CHECK_ASSIGN,
        INV_HALFYEAR_RESULT,
        PSVAR_FORM,
        PSCIH_FORM,
        MV_IMM_ITEMMST,
        INV_CHECK_LOG,
    ], 'mitsuConnection'),FormModule, FormmstModule],
    controllers: [PsVarController],
    providers: [PsVarService, PsVarRepository],
})
export class PsVarModule {}
