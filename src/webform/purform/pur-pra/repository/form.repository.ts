import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { PURPRA_FORM } from 'src/common/Entities/webform/table/PURPRA_FORM.entity';

@Injectable()
export class FormRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    create(data: PURPRA_FORM) {
        return this.getRepository(PURPRA_FORM).save(data);
    }

}
