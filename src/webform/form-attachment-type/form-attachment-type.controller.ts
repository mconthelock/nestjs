import { Controller } from '@nestjs/common';
import { FormAttachmentTypeService } from './form-attachment-type.service';
import { CreateFormAttachmentTypeDto } from './dto/create-form-attachment-type.dto';
import { UpdateFormAttachmentTypeDto } from './dto/update-form-attachment-type.dto';

@Controller('form-attachment-type')
export class FormAttachmentTypeController {
    constructor(
        private readonly formAttachmentTypeService: FormAttachmentTypeService,
    ) {}
}
