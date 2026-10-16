import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PILINE_PROBLEM_MST } from 'src/common/Entities/workload/table/PILINE_PROBLEM_MST.entity';
import { PilineCrudRepository } from '../piline/PILINE-CRUD.repository';

@Injectable()
export class PilineProblemMstRepository extends PilineCrudRepository<PILINE_PROBLEM_MST> {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds, PILINE_PROBLEM_MST);
    }
}
