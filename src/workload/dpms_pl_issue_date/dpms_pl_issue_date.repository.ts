import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DPMS_PL_ISSUE_PK } from 'src/mfgreport/dpms/packing-list-issue/packing-list-issue.interface';
import { DPMS_PL_ISSUE_DATE } from 'src/common/Entities/workload/views/DPMS_PL_ISSUE_DATE.entity';

@Injectable()
export class DpmsPlIssueDateRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }
    findOne(dto: DPMS_PL_ISSUE_PK) {
        return this.getRepository(DPMS_PL_ISSUE_DATE).findOne({
            where: { ...dto },
        });
    }
}
