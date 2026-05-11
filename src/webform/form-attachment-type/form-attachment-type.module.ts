import { Module } from '@nestjs/common';
import { FormAttachmentTypeService } from './form-attachment-type.service';
import { FormAttachmentTypeController } from './form-attachment-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FORM_ATTACHMENT_TYPE } from 'src/common/Entities/webform/table/FORM_ATTACHMENT_TYPE.entity';
import { FormAttachmentRepository } from './form-attachment-type.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([FORM_ATTACHMENT_TYPE], 'webformConnection'),
    ],
    controllers: [FormAttachmentTypeController],
    providers: [FormAttachmentTypeService, FormAttachmentRepository],
    exports: [FormAttachmentTypeService],
})
export class FormAttachmentTypeModule {}
