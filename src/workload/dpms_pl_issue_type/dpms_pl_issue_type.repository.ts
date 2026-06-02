import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DPMS_PL_ISSUE_TYPE } from 'src/common/Entities/workload/table/DPMS_PL_ISSUE_TYPE.entity';

@Injectable()
export class DpmsPlIssueTypeRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async findAll(): Promise<DPMS_PL_ISSUE_TYPE[]> {
        return this.getRepository(DPMS_PL_ISSUE_TYPE).find({
            order:{
                NSEQ: 'ASC',
            }
        });
    }
}
