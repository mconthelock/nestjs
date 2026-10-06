import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, IsNull } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { PURPRA_REASON_MASTER } from 'src/common/Entities/webform/table/PURPRA_REASON_MASTER.entity';

@Injectable()
export class ReasonsRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findByGroup(groupCode: string) {
        return this.getRepository(PURPRA_REASON_MASTER).find({
            where: {
                VGROUP_CODE: groupCode,
                NACTIVE: 1,
                NPARENT_ID: IsNull(),
            },
            relations: {
                children: true,
            },
            order: {
                NSEQ: 'ASC',
            },
        });
    }
}
