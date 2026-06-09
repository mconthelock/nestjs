import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DPMS_PL_CASE_LIST_DETAIL } from 'src/common/Entities/workload/table/DPMS_PL_CASE_LIST_DETAIL.entity';
import { CreateDpmsPlCaseListDetailDto } from './dto/create-dpms_pl_case_list_detail.dto';

@Injectable()
export class DpmsPlCaseListDetailRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    create(dto: CreateDpmsPlCaseListDetailDto) {
        return this.getRepository(DPMS_PL_CASE_LIST_DETAIL).save(dto);
    }
}
