import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FORM_ATTACHMENT_TYPE } from 'src/common/Entities/webform/table/FORM_ATTACHMENT_TYPE.entity';
import { CreateFormAttachmentTypeDto } from './dto/create-form-attachment-type.dto';
import {
    SearchFormAttachmentTypeDto,
    UpdateFormAttachmentTypeDto,
} from './dto/update-form-attachment-type.dto';

@Injectable()
export class FormAttachmentRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findOne(dto: SearchFormAttachmentTypeDto) {
        return this.getRepository(FORM_ATTACHMENT_TYPE).findOneBy(dto);
    }

    async create(dto: CreateFormAttachmentTypeDto) {
        return await this.getRepository(FORM_ATTACHMENT_TYPE).save(dto);
    }
}
