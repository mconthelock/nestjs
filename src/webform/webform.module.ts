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
import { PurCpmModule } from './purform/pur-cpm/pur-cpm.module';
import { PurFileModule } from './purform/pur-file/pur-file.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { GPFormModule } from './gpform/gpform.module';
import { FinformModule } from './finform/finform.module';

@Module({
    imports: [
        //Forms List
        IEFormModule,
        ISFormModule,
        QAFormModule,
        GPFormModule,
        FinformModule,
        RepModule,
        //Main Modules
        FormModule,
        FlowModule,
        FlowmstModule,
        FormmstModule,
        OrgposModule,
        OrgTreeModule,
        OrganizationsModule,
        RqffrmModule,
        PurCpmModule,
        PurFileModule,
        SequenceOrgModule,
    ],
})
export class WebformModule {}
