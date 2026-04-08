import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { FormmstModule } from '../formmst/formmst.module';
import { FlowmstModule } from '../flowmst/flowmst.module';
import { UsersModule } from 'src/amec/users/users.module';
import { OrgTreeModule } from 'src/webform/org-tree/org-tree.module';
import { RepModule } from '../rep/rep.module';
import { FlowModule } from '../flow/flow.module';
import { OrgposModule } from '../orgpos/orgpos.module';
import { SequenceOrgModule } from '../sequence-org/sequence-org.module';
import { FormCreateService } from './create-form.service';
import { FormRepository } from './form.repository';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { FLOW } from 'src/common/Entities/webform/table/FLOW.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([FORM, FLOW], 'webformConnection'),
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
    providers: [FormService, FormCreateService, FormRepository],
    exports: [FormService, FormCreateService],
})
export class FormModule {}
