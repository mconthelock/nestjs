import { Module } from '@nestjs/common';
import { StInpService } from './st-inp.service';
import { StInpController } from './st-inp.controller';
import { FormModule } from 'src/webform/center/form/form.module';
import { FormmstModule } from 'src/webform/center/formmst/formmst.module';
import { StyImageModule } from 'src/gpreport/sty-image/sty-image.module';
import { StyTypeModule } from 'src/gpreport/sty-type/sty-type.module';
import { StInpCreateService } from './st-inp-create.service';
import { FlowModule } from 'src/webform/center/flow/flow.module';
import { StInpCorrectiveService } from './st-inp-corrective.service';
import { StInpEvaluateService } from './st-inp-evaluate.service';
import { StinpFormListModule } from 'src/gpreport/stinp-form-list/stinp-form-list.module';
import { StinpFormModule } from 'src/gpreport/stinp-form/stinp-form.module';
import { StInpSaveDraftService } from './st-inp-saveDraft.service';
import { StInpJobAlertService } from './job/st-inp-mail-alert.service';
import { StInpRepository } from './st-inp.repository';
import { MailModule } from 'src/common/services/mail/mail.module';
import { SequenceOrgModule } from 'src/webform/center/sequence-org/sequence-org.module';

@Module({
    imports: [
        FormModule,
        FormmstModule,
        FlowModule,
        StyImageModule,
        StyTypeModule,
        StinpFormModule,
        StinpFormListModule,
        MailModule,
        SequenceOrgModule,
    ],
    controllers: [StInpController],
    providers: [
        StInpService,
        StInpCreateService,
        StInpCorrectiveService,
        StInpSaveDraftService,
        StInpEvaluateService,
        StInpJobAlertService,
        StInpRepository,
    ],
    exports: [StInpService],
})
export class StInpModule {}
