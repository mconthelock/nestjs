import { Module } from '@nestjs/common';
import { IeTsService } from './ie-ts.service';
import { IeTsApproveService } from './ie-ts-approve.service';
import { IeTsController } from './ie-ts.controller';
import { IetsFormModule } from './iets_form/iets_form.module';
import { IetsListModule } from './iets_list/iets_list.module';
import { FormModule } from 'src/webform/form/form.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { FlowModule } from 'src/webform/flow/flow.module';
import { VorgmstModule } from 'src/webform/vorgmst/vorgmst.module';
import { OrgposModule } from 'src/webform/orgpos/orgpos.module';
import { IePtsModule } from '../IE-PTS/ie-pts.module';
import { IeTsJobService } from './ie-ts-job.service';
import { UsersModule } from 'src/amec/users/users.module';
import { MailModule } from 'src/common/services/mail/mail.module';

@Module({
    controllers: [IeTsController],
    providers: [IeTsService, IeTsApproveService, IeTsJobService],
    imports: [
        IetsFormModule,
        IetsListModule,
        FormModule,
        VorgmstModule,
        OrgposModule,
        FlowModule,
        IePtsModule,
        FormmstModule,
        UsersModule,
        MailModule,
    ],
})
export class IeTsModule {}
