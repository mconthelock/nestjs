import { Module } from '@nestjs/common';
import { IsCfsService } from './is-cfs.service';
import { IsCfsController } from './is-cfs.controller';
import { IsCfsRepository } from './is-cfs.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ISCFS_FORM } from 'src/common/Entities/webform/table/ISCFS_FORM.entity';
import { IsCfsCreateFormService } from './is-cfs-createForm.service';
import { FormModule } from 'src/webform/form/form.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { SequenceOrgModule } from 'src/webform/sequence-org/sequence-org.module';
import { FlowModule } from 'src/webform/flow/flow.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ISCFS_FORM], 'webformConnection'),
        FormModule,
        FlowModule,
        FormmstModule,
        SequenceOrgModule,
    ],
    controllers: [IsCfsController],
    providers: [IsCfsService, IsCfsCreateFormService, IsCfsRepository],
    exports: [IsCfsService, IsCfsCreateFormService],
})
export class IsCfsModule {}
