import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PILINE_EVENT_MST } from 'src/common/Entities/workload/table/PILINE_EVENT_MST.entity';
import { PilineCrudRepository } from '../piline/PILINE-CRUD.repository';

@Injectable()
export class PilineEventMstRepository extends PilineCrudRepository<PILINE_EVENT_MST> {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds, PILINE_EVENT_MST);
    }
}
