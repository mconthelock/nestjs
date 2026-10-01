import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, In } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

import { PURCPC_PROC_COMPARE_VIEW } from 'src/common/Entities/webform/views/PURCPC_PROC_COMPARE_VIEW.entity';
@Injectable()
export class PurcpcProcCompareViewRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        return this.getRepository(PURCPC_PROC_COMPARE_VIEW).find();
    }

    findByItemCode(itemCode: string[]) {
        return this.getRepository(PURCPC_PROC_COMPARE_VIEW).find({
            where: { VITEM_CODE: In(itemCode) },
        });
    }
}
