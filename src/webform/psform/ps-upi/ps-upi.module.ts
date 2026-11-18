import { Module } from '@nestjs/common';
import { PsUpiService } from './ps-upi.service';
import { PsUpiController } from './ps-upi.controller';
import { PsUpiRepository } from './ps-upi.repository';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { FormModule } from 'src/webform/form/form.module';
import { FlowModule } from 'src/webform/flow/flow.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PSUPI_REQUISITION } from 'src/common/Entities/webform/table/PSUPI_REQUISITION.entity';
import { PSUPI_REASON } from 'src/common/Entities/webform/table/PSUPI_REASON.entity';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { FORMMST } from 'src/common/Entities/webform/table/FORMMST.entity';
import { User } from 'src/common/Entities/webform/views/AMECUSERALL.entity';
import { FLOW } from '../../../common/Entities/webform/table/FLOW.entity';
import { QAINS_FORM } from '../../../common/Entities/webform/table/QAINS_FORM.entity';
import { FORMMST_GROUP } from '../../../common/Entities/webform/table/FORMMST_GROUP.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        PSUPI_REQUISITION,
        PSUPI_REASON,
        FORM,
        FORMMST,
        User,
        FLOW,
        QAINS_FORM,
        FORMMST_GROUP,
    ], 'mitsuConnection'),FormModule, FormmstModule, FlowModule],
    controllers: [PsUpiController],
    providers: [PsUpiService, PsUpiRepository],
})
export class PsUpiModule {}
