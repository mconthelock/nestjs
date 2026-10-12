import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PILINE_LOCATION_MST } from 'src/common/Entities/workload/table/PILINE_LOCATION_MST.entity';
import { PilineCrudRepository } from '../piline/PILINE-CRUD.repository';

@Injectable()
export class PilineLocationMstRepository extends PilineCrudRepository<PILINE_LOCATION_MST> {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds, PILINE_LOCATION_MST);
    }
}
