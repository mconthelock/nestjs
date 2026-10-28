import { Module } from '@nestjs/common';
import { IeTsService } from './ie-ts.service';
import { IeTsApproveService } from './ie-ts-approve.service';
import { IeTsController } from './ie-ts.controller';
import { IetsFormModule } from './iets_form/iets_form.module';
import { IetsListModule } from './iets_list/iets_list.module';
import { FormModule } from 'src/webform/form/form.module';
import { FlowModule } from 'src/webform/flow/flow.module';
import { VorgmstModule } from 'src/webform/vorgmst/vorgmst.module';
import { OrgposModule } from 'src/webform/orgpos/orgpos.module';

@Module({
    controllers: [IeTsController],
    providers: [IeTsService, IeTsApproveService],
    imports: [
        IetsFormModule,
        IetsListModule,
        FormModule,
        VorgmstModule,
        OrgposModule,
        FlowModule,
    ],
})
export class IeTsModule {}
