import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PILINE_NG_RECORD } from 'src/common/Entities/workload/table/PILINE_NG_RECORD.entity';
import { PilineCrudRepository } from '../piline/PILINE-CRUD.repository';

@Injectable()
export class PilineNgRecordRepository extends PilineCrudRepository<PILINE_NG_RECORD> {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds, PILINE_NG_RECORD);
    }
}
