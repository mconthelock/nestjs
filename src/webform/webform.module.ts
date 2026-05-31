import { Module } from '@nestjs/common';
import { FormModule } from './form/form.module';
import { FlowModule } from './flow/flow.module';
import { ISFormModule } from './isform/isform.module';
import { FlowmstModule } from './flowmst/flowmst.module';
import { FormmstModule } from './formmst/formmst.module';
import { QAFormModule } from './qaform/qaform.module';
import { OrgposModule } from './orgpos/orgpos.module';
import { OrgTreeModule } from './org-tree/org-tree.module';
import { SequenceOrgModule } from './sequence-org/sequence-org.module';
import { RepModule } from './rep/rep.module';
import { IEFormModule } from './ieform/ie.module';
import { RqffrmModule } from './rqffrm/rqffrm.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { GpformModule } from './gpform/gpform.module';
import { FinformModule } from './finform/finform.module';
import { HandleFileFormModule } from './handle-file-form/handle-file-form.module';
import { FormAttachmentTypeModule } from './form-attachment-type/form-attachment-type.module';
import { FeformModule } from './feform/feform.module';
import { MarFormModule } from './marform/marform.module';
import { STFormModule } from './stform/stform.module';
import { PurFormModule } from './purform/purform.module';
import { PsFormModule } from './psform/psform.module';
import { RqflistModule } from './rqflist/rqflist.module';

@Module({
    imports: [
        //Dept from modules
        GpformModule,
        IEFormModule,
        ISFormModule,
        QAFormModule,
        PurFormModule,
        FinformModule,
        FeformModule,
        PsFormModule,
        STFormModule,
        MarFormModule,
        //Form Master and Form Center Modules
        FormModule,
        FlowModule,
        FlowmstModule,
        FormmstModule,
        OrgposModule,
        OrgTreeModule,
        SequenceOrgModule,
        RepModule,
        OrganizationsModule,
        HandleFileFormModule,
        FormAttachmentTypeModule,
        RqffrmModule,
        RqflistModule,
    ],
})
export class WebformModule {}
