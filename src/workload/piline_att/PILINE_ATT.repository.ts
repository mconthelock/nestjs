import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PILINE_ATT } from 'src/common/Entities/workload/table/PILINE_ATT.entity';
import { PilineCrudRepository } from '../piline/PILINE-CRUD.repository';

@Injectable()
export class PilineAttRepository extends PilineCrudRepository<PILINE_ATT> {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds, PILINE_ATT);
    }
}
