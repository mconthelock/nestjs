import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PILINE_CAUSE_MST } from 'src/common/Entities/workload/table/PILINE_CAUSE_MST.entity';
import { PilineCrudRepository } from '../piline/PILINE-CRUD.repository';

@Injectable()
export class PilineCauseMstRepository extends PilineCrudRepository<PILINE_CAUSE_MST> {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds, PILINE_CAUSE_MST);
    }
}
