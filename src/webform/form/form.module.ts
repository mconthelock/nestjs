import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { Form } from './entities/form.entity';
import { Flow } from './../flow/entities/flow.entity';
import { FormmstModule } from '../formmst/formmst.module';
import { FlowmstModule } from '../flowmst/flowmst.module';
import { UsersModule } from 'src/amec/users/users.module';
import { OrgTreeModule } from 'src/webform/org-tree/org-tree.module';
import { RepModule } from '../rep/rep.module';
import { FlowModule } from '../flow/flow.module';
import { OrgposModule } from '../orgpos/orgpos.module';
import { SequenceOrgModule } from '../sequence-org/sequence-org.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Form, Flow], 'webformConnection'),
    FormmstModule,
    UsersModule,
    FlowmstModule,
    OrgTreeModule,
    RepModule,
    forwardRef(() => FlowModule),
    OrgposModule,
    SequenceOrgModule,
  ],
  controllers: [FormController],
  providers: [FormService],
  exports: [FormService],
})
export class FormModule {}
