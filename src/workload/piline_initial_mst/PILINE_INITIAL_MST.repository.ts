import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PILINE_INITIAL_MST } from 'src/common/Entities/workload/table/PILINE_INITIAL_MST.entity';
import { PilineCrudRepository } from '../piline/PILINE-CRUD.repository';

@Injectable()
export class PilineInitialMstRepository extends PilineCrudRepository<PILINE_INITIAL_MST> {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds, PILINE_INITIAL_MST);
    }
}
