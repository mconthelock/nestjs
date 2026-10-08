import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DPMS_PACKING_LIST_MAIN } from 'src/common/Entities/workload/views/DPMS_PACKING_LIST_MAIN.entity';

@Injectable()
export class DpmsPackingListMainRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async findPackingListByMfgNo(mfgNo: string): Promise<DPMS_PACKING_LIST_MAIN[]> {
        return this.getRepository(DPMS_PACKING_LIST_MAIN).find({
            where: {
                VMFGNO: mfgNo,
            },
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
    async findPackingListPoByMfgNo(mfgNo: string): Promise<DPMS_PACKING_LIST_MAIN[]> {
        return this.getRepository(DPMS_PACKING_LIST_MAIN).find({
            where: {
                VMFGNO: mfgNo,
            },
            relations: ['DETAILS_PO'], // ดึงข้อมูลรายละเอียดที่เกี่ยวข้องด้วย
            order: {
                VCASE: 'ASC',
                DETAILS_PO: {
                    VMFGNO: 'ASC', 
                    VCASE: 'ASC',
                    VITEM: 'ASC',
                    VDRAWING: 'ASC',
                },
            }
        });
    }
}
