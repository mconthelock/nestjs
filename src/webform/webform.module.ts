import { Module } from '@nestjs/common';
//Center Modules
import { FlowModule } from './center/flow/flow.module';
import { FlowmstModule } from './center/flowmst/flowmst.module';
import { FormModule } from './center/form/form.module';
import { FormAttachmentTypeModule } from './center/form-attachment-type/form-attachment-type.module';
import { FormmstGroupModule } from './center/formmst-group/formmst-group.module';
import { FormmstModule } from './center/formmst/formmst.module';
import { HandleFileFormModule } from './center/handle-file-form/handle-file-form.module';
import { OrganizationsModule } from './center/organizations/organizations.module';
import { OrgposModule } from './center/orgpos/orgpos.module';
import { OrgTreeModule } from './center/org-tree/org-tree.module';
import { RepModule } from './center/rep/rep.module';
import { RqffrmModule } from './center/rqffrm/rqffrm.module';
import { RqflistModule } from './center/rqflist/rqflist.module';
import { SequenceOrgModule } from './center/sequence-org/sequence-org.module';

//Dept Modules
import { FeformModule } from './feform/feform.module';
import { FinformModule } from './finform/finform.module';
import { GpformModule } from './gpform/gpform.module';
import { IEFormModule } from './ieform/ie.module';
import { ISFormModule } from './isform/isform.module';
import { MarFormModule } from './marform/marform.module';
import { PsFormModule } from './psform/psform.module';
import { PurFormModule } from './purform/purform.module';
import { QAFormModule } from './qaform/qaform.module';
import { STFormModule } from './stform/stform.module';

@Module({
    imports: [
        //Dept modules
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
        //Center Modules
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
        FormmstGroupModule,
    ],
})
export class WebformModule {}
