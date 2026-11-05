import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { PURPRA_GROUP } from 'src/common/Entities/webform/table/PURPRA_GROUP.entity';

@Injectable()
export class GroupRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        return this.getRepository(PURPRA_GROUP).find({
            order: {
                NSEQ: 'ASC',
            },
        });
    }
}
