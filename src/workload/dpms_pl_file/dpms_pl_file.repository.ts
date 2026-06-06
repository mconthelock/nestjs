import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import type { CreateDpmsPlFileDto } from './dto/create-dpms_pl_file.dto';
import { DPMS_PL_FILE } from 'src/common/Entities/workload/table/DPMS_PL_FILE.entity';

@Injectable()
export class DpmsPlFileRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async create(dto: CreateDpmsPlFileDto) {
        return await this.getRepository(DPMS_PL_FILE).save(dto);
    }
}
