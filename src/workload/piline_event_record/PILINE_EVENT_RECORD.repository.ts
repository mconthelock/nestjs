import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PILINE_EVENT_RECORD } from 'src/common/Entities/workload/table/PILINE_EVENT_RECORD.entity';
import { PilineCrudRepository } from '../piline/PILINE-CRUD.repository';

@Injectable()
export class PilineEventRecordRepository extends PilineCrudRepository<PILINE_EVENT_RECORD> {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds, PILINE_EVENT_RECORD);
    }
}
