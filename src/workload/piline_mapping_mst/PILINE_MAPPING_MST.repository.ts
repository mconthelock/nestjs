import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PILINE_MAPPING_MST } from 'src/common/Entities/workload/table/PILINE_MAPPING_MST.entity';
import { PilineCrudRepository } from '../piline/PILINE-CRUD.repository';

@Injectable()
export class PilineMappingMstRepository extends PilineCrudRepository<PILINE_MAPPING_MST> {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds, PILINE_MAPPING_MST);
    }
}
