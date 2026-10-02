import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { R027Mp1Module } from 'src/as400/datalibo/r027mp1/r027mp1.module';
import { MailModule } from 'src/common/services/mail/mail.module';

@Module({
    controllers: [QaCnController],
    providers: [QaCnService],
    imports: [
        TypeOrmModule,
        CnformModule,
        ResultchkdwgModule,
        AttcnfrmModule,
        FormModule,
        FlowModule,
        OrgposModule,
        HpoModule,
        J736kpModule,
        R027Mp1Module,
        MailModule,
    ],
})
export class QaCnModule {}
