import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FormDto } from '../form/dto/form.dto';
import { RQFLIST } from 'src/common/Entities/webform/table/RQFLIST.entity';

@Injectable()
export class RqflistRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findOne(form: FormDto) {
        return this.getRepository(RQFLIST).findOneBy(form);
    }
}
