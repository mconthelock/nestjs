import { Module } from '@nestjs/common';
import { IeBgrService } from './ie-bgr.service';
import { IeBgrController } from './ie-bgr.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormModule } from 'src/webform/form/form.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { EbgreqformModule } from 'src/ebudget/ebgreqform/ebgreqform.module';
import { EbgreqattfileModule } from 'src/ebudget/ebgreqattfile/ebgreqattfile.module';
import { EbgreqcolImageModule } from 'src/ebudget/ebgreqcol-image/ebgreqcol-image.module';
import { FlowModule } from 'src/webform/flow/flow.module';
import { EbudgetQuotationModule } from 'src/ebudget/ebudget-quotation/ebudget-quotation.module';
import { EbudgetQuotationProductModule } from 'src/ebudget/ebudget-quotation-product/ebudget-quotation-product.module';
import { PprbiddingModule } from 'src/amec/pprbidding/pprbidding.module';
import { MailModule } from 'src/common/services/mail/mail.module';
import { IEBGR_REPORT_VIEW } from 'src/common/Entities/webform/views/IEBGR_REPORT_VIEW.entity';
import { PpoModule } from 'src/amec/ppo/ppo.module';
import { IeBgrRepository } from './ie-bgr.repository';
import { IeBgrCreateService } from './ie-bgr-create.service';
import { IeBgrDraftService } from './ie-bgr-draft.sevice';
import { IeBgrLastApvService } from './ie-bgr-lastApv.service';

@Module({
    imports: [
        FormModule,
        FormmstModule,
        EbgreqformModule,
        EbgreqattfileModule,
        EbgreqcolImageModule,
        EbudgetQuotationModule,
        EbudgetQuotationProductModule,
        FlowModule,
        PprbiddingModule,
        MailModule,
        PpoModule,
        TypeOrmModule.forFeature([IEBGR_REPORT_VIEW], 'webformConnection'),
    ],
    controllers: [IeBgrController],
    providers: [
        IeBgrService,
        IeBgrCreateService,
        IeBgrDraftService,
        IeBgrLastApvService,
        IeBgrRepository,
    ],
})
export class IeBgrFormModule {}
