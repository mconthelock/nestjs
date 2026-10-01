import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { FORM_LINK } from 'src/common/Entities/webform/table/FROM_LINK.entitiy';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class FormLinkRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    create(data: FORM_LINK) {
        return this.getRepository(FORM_LINK).save(data);
    }

    delete(formNo: string) {
        return this.getRepository(FORM_LINK).delete([
            { VFORM1: formNo },
            { VFORM2: formNo },
        ]);
    }
}
