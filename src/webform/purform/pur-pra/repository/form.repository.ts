import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { PURPRA_FORM } from 'src/common/Entities/webform/table/PURPRA_FORM.entity';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Injectable()
export class FormRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    create(data: PURPRA_FORM) {
        return this.getRepository(PURPRA_FORM).save(data);
    }

    findByForm(form: FormDto) {
        return this.getRepository(PURPRA_FORM).findOne({
            where: form,
            relations: {
                FORM: true,
                LINK_FORM: true,
                GROUP: true,
                COMMITTEE: true,
                FILES: {
                    TYPE: true,
                },
                REASONS: {
                    REASON_MASTER: true,
                },
            },
        });
    }
}
