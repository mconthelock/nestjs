import { Module } from '@nestjs/common';
import { FormModule } from './form/form.module';
import { FlowModule } from './flow/flow.module';
import { ISFormModule } from './isform/isform.module';
import { FlowmstModule } from './flowmst/flowmst.module';
import { FormmstModule } from './formmst/formmst.module';
import { GpOtModule } from './gpform/gp-ot/gp-ot.module';
import { QAFormModule } from './qaform/qaform.module';
import { OrgposModule } from './orgpos/orgpos.module';
import { OrgTreeModule } from './org-tree/org-tree.module';
import { SequenceOrgModule } from './sequence-org/sequence-org.module';
import { RepModule } from './rep/rep.module';
import { IEFormModule } from './ieform/ie.module';

@Module({
  imports: [
    IEFormModule,
    ISFormModule,
    FormModule,
    FlowModule,
    FlowmstModule,
    FormmstModule,
    GpOtModule,
    QAFormModule,
    OrgposModule,
    OrgTreeModule,
    SequenceOrgModule,
    RepModule
  ],
})
export class WebformModule {}
