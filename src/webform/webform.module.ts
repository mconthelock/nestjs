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
import { MfgOrModule } from './mfgform/mfg-or/mfg-or.module';
import { VorgmstModule } from './vorgmst/vorgmst.module';
import { GrpmstModule } from './grpmst/grpmst.module';
import { MfgEdrModule } from './mfgform/mfg-edr/mfg-edr.module';
// FIN-PCK
import { FinpckFormModule } from './finform/fin-pck/finpck_form/finpck_form.module';
import { FinpckAssetModule } from './finform/fin-pck/finpck_asset/finpck_asset.module';

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
        RepModule,
        RqffrmModule,
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
        RqflistModule,
        VorgmstModule,
        MfgOrModule,
        GrpmstModule,
        // OMG
        MfgEdrModule,
        MfgOrModule,
        //FIN-PCK
        FinpckFormModule,
        FinpckAssetModule,
    ],
})
export class WebformModule {}
