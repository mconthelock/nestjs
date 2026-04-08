import { Module } from '@nestjs/common';
import { IsTidService } from './is-tid.service';
import { IsTidController } from './is-tid.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ISTID_FORM } from 'src/common/Entities/webform/table/ISTID_FORM.entity';
import { IsTidRepository } from './is-tid.repository';
import { IsTidCreateFormService } from './is-tid-createForm.service';
import { FormModule } from 'src/webform/form/form.module';
import { SequenceOrgModule } from 'src/webform/sequence-org/sequence-org.module';
import { FlowModule } from 'src/webform/flow/flow.module';
import { IsCfsModule } from '../is-cfs/is-cfs.module';
import { IsTidActionService } from './is-tid-updateForm.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ISTID_FORM], 'webformConnection'),
        FormModule,
        FlowModule,
        IsCfsModule,
        SequenceOrgModule,
    ],
    controllers: [IsTidController],
    providers: [
        IsTidService,
        IsTidCreateFormService,
        IsTidActionService,
        IsTidRepository,
    ],
    exports: [IsTidService],
})
export class IsTidModule {}
