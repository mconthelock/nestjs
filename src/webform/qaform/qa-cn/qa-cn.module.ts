import { Module } from '@nestjs/common';
<<<<<<< HEAD
<<<<<<< HEAD
import { TypeOrmModule } from '@nestjs/typeorm';
import { QaCnService } from './qa-cn.service';
import { QaCnController } from './qa-cn.controller';
import { CnformModule } from './cnform/cnform.module';
import { ResultchkdwgModule } from './resultchkdwg/resultchkdwg.module';
import { AttcnfrmModule } from './attcnfrm/attcnfrm.module';
import { FormModule } from 'src/webform/form/form.module';
import { FlowModule } from 'src/webform/flow/flow.module';
import { OrgposModule } from 'src/webform/orgpos/orgpos.module';
<<<<<<< HEAD
<<<<<<< HEAD
import { HpoModule } from 'src/as400/bpcsfvnew/hpo/hpo.module';
import { J736kpModule } from 'src/as400/rtnlibf/j736kp/j736kp.module';
import { R027Mp1Module } from 'src/as400/datalibo/r027mp1/r027mp1.module';
import { MailModule } from 'src/common/services/mail/mail.module';
<<<<<<< HEAD
=======
>>>>>>> 093c063b (QA-CN)
=======
import { HpoModule } from 'src/as400/bpcsfvnew/hpo/hpo.module';
import { J736kpModule } from 'src/as400/rtnlibf/j736kp/j736kp.module';
>>>>>>> 38e4fc7c (QA-CN)
=======
>>>>>>> 14243a62 (QA-CN)

@Module({
    controllers: [QaCnController],
    providers: [QaCnService],
    imports: [
<<<<<<< HEAD
<<<<<<< HEAD
        TypeOrmModule,
=======
>>>>>>> 093c063b (QA-CN)
=======
        TypeOrmModule,
>>>>>>> 14243a62 (QA-CN)
        CnformModule,
        ResultchkdwgModule,
        AttcnfrmModule,
        FormModule,
        FlowModule,
        OrgposModule,
<<<<<<< HEAD
<<<<<<< HEAD
        HpoModule,
        J736kpModule,
        R027Mp1Module,
        MailModule,
<<<<<<< HEAD
=======
>>>>>>> 093c063b (QA-CN)
=======
        HpoModule,
        J736kpModule,
>>>>>>> 38e4fc7c (QA-CN)
=======
>>>>>>> 14243a62 (QA-CN)
    ],
=======
=======
import { TypeOrmModule } from '@nestjs/typeorm';
>>>>>>> 14243a62 (QA-CN)
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
<<<<<<< HEAD
  controllers: [QaCnController],
  providers: [QaCnService],
<<<<<<< HEAD
>>>>>>> 7c3a64c8 (QA-CN)
=======
  imports: [CnformModule, ResultchkdwgModule, AttcnfrmModule],
>>>>>>> 67c79348 (PUR-EVA)
=======
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
>>>>>>> 093c063b (QA-CN)
})
export class QaCnModule {}
