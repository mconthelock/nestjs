import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, In } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { PURCPC_PROC_ITEMDETAIL } from 'src/common/Entities/webform/views/PURCPC_PROC_ITEMDETAIL.entity';

@Injectable()
export class PurcpcProcItemDetailRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findItemDetail(item: string[]) {
        return this.getRepository(PURCPC_PROC_ITEMDETAIL).find({
            where: { ITEM_CODE: In(item) },
        });
    }
}
