import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { PURCPC_FORM } from 'src/common/Entities/webform/table/PURCPC_FORM.entity';

import { pkForm } from '../interface/create.interface';

@Injectable()
export class PurCpcRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    create(data: any) {
        return this.getRepository(PURCPC_FORM).save(data);
    }

    async getFormNextRunNo(cyear2: string) {
        return this.getRepository(PURCPC_FORM).find({
            where: {
                CYEAR2: cyear2,
            },
            order: {
                NRUNNO: 'DESC',
            },
            take: 1,
        });
    }
}
