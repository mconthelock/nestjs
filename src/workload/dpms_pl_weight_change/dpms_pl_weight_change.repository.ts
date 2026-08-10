import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DPMS_PL_WEIGHT_CHANGE } from 'src/common/Entities/workload/views/DPMS_PL_WEIGHT_CHANGE.entity';

@Injectable()
export class DpmsPlWeightChangeRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    getChangeWeight() {
        return this.getRepository(DPMS_PL_WEIGHT_CHANGE).find();
    }
}
