import { Module } from '@nestjs/common';
import { QaCnService } from './qa-cn.service';
import { QaCnController } from './qa-cn.controller';
import { CnformModule } from './cnform/cnform.module';
import { ResultchkdwgModule } from './resultchkdwg/resultchkdwg.module';
import { AttcnfrmModule } from './attcnfrm/attcnfrm.module';
import { FormModule } from 'src/webform/form/form.module';
import { FlowModule } from 'src/webform/flow/flow.module';
import { OrgposModule } from 'src/webform/orgpos/orgpos.module';
import { HpoModule } from 'src/as400/bpcsfvnew/hpo/hpo.module';
import { J736kpModule } from 'src/as400/rtnlibf/j736kp/j736kp.module';

@Module({
    controllers: [QaCnController],
    providers: [QaCnService],
    imports: [
        CnformModule,
        ResultchkdwgModule,
        AttcnfrmModule,
        FormModule,
        FlowModule,
        OrgposModule,
        HpoModule,
        J736kpModule,
    ],
})
export class QaCnModule {}
