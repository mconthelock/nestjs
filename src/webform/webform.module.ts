import { Module } from '@nestjs/common';

import { FormModule } from './form/form.module';
import { FlowModule } from './flow/flow.module';
import { FlowmstModule } from './flowmst/flowmst.module';
import { FormmstModule } from './formmst/formmst.module';
import { OrgposModule } from './orgpos/orgpos.module';
import { OrgTreeModule } from './org-tree/org-tree.module';
import { RepModule } from './rep/rep.module';
import { SequenceOrgModule } from './sequence-org/sequence-org.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { HandleFileFormModule } from './handle-file-form/handle-file-form.module';
import { FormAttachmentTypeModule } from './form-attachment-type/form-attachment-type.module';
import { VorgmstModule } from './vorgmst/vorgmst.module';
import { GrpmstModule } from './grpmst/grpmst.module';

import { DedformModule } from './dedform/dedform.module';
import { EplformModule } from './eplform/eplform.module';
import { FeformModule } from './feform/feform.module';
import { FinformModule } from './finform/finform.module';
import { GpformModule } from './gpform/gpform.module';
import { IEFormModule } from './ieform/ie.module';
import { ISFormModule } from './isform/isform.module';
import { MfgformModule } from './mfgform/mfgform.module';
import { MarFormModule } from './marform/marform.module';
import { PsFormModule } from './psform/psform.module';
import { PurFormModule } from './purform/purform.module';
import { QAFormModule } from './qaform/qaform.module';
import { STFormModule } from './stform/stform.module';

@Module({
    imports: [
        IEFormModule,
        MfgformModule,
        ISFormModule,
        FormModule,
        FlowModule,
        FlowmstModule,
        FormmstModule,
        QAFormModule,
        OrgposModule,
        OrgTreeModule,
        SequenceOrgModule,
        RepModule,
        PurFormModule,
        OrganizationsModule,
        GpformModule,
        FinformModule,
        HandleFileFormModule,
        FormAttachmentTypeModule,
        FeformModule,
        MarFormModule,
        PsFormModule,
        STFormModule,
        VorgmstModule,
        GrpmstModule,
        DedformModule,
        EplformModule,
    ],
})
export class WebformModule {}
