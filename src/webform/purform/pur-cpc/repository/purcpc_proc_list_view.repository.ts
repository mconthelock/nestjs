import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, In } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { PURCPC_PROC_LIST_VIEW } from 'src/common/Entities/webform/views/PURCPC_PROC_LIST_VIEW.entity';

@Injectable()
export class PurcpcProcPlanViewRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        return this.getRepository(PURCPC_PROC_LIST_VIEW).find();
    }

    findByPlanner(planner: string[]) {
        return this.getRepository(PURCPC_PROC_LIST_VIEW).find({
            where: { VPLANNER_CODE: In(planner) },
        });
    }
}
