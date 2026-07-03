import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DPMS_PL_CASE_LIST } from 'src/common/Entities/workload/table/DPMS_PL_CASE_LIST.entity';
import { CreateDpmsPlCaseListDto } from './dto/create-dpms_pl_case_list.dto';

@Injectable()
export class DpmsPlCaseListRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    create(dto: CreateDpmsPlCaseListDto) {
        return this.getRepository(DPMS_PL_CASE_LIST).save(dto);
    }

    findByRevId(revId: number) {
        return this.getRepository(DPMS_PL_CASE_LIST).find({
            where: { NISSUEREV_ID: revId },
            relations: ['DETAILS'], // ดึงข้อมูลรายละเอียดที่เกี่ยวข้องด้วย
            order: {
                VCASE: 'ASC',
                DETAILS: {
                    VMFGNO: 'ASC', 
                    VCASE: 'ASC',
                    VITEM: 'ASC',
                    VDRAWING: 'ASC',
                },
            }
        });
    }
}
