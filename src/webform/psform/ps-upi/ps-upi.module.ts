import { Module } from '@nestjs/common';
import { PsUpiService } from './ps-upi.service';
import { PsUpiController } from './ps-upi.controller';
import { PsUpiRepository } from './ps-upi.repository';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { FormModule } from 'src/webform/form/form.module';
import { FlowModule } from 'src/webform/flow/flow.module';

@Module({
    imports: [FormModule, FormmstModule, FlowModule],
    controllers: [PsUpiController],
    providers: [PsUpiService, PsUpiRepository],
})
export class PsUpiModule {}
