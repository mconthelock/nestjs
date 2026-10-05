import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { PURPRA_COMMITTEE } from 'src/common/Entities/webform/table/PURPRA_COMMITTEE.entity';

@Injectable()
export class CommitteeRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        return this.getRepository(PURPRA_COMMITTEE).find({
            order: {
                NSEQ: 'ASC'
            }
        });
    }
}
