import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DPMS_PACKING_LIST_DETAIL } from 'src/common/Entities/workload/views/DPMS_PACKING_LIST_DETAIL.entity';

@Injectable()
export class DpmsPackingListDetailRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    getOrderOrigin(order: string) {
        return this.getRepository(DPMS_PACKING_LIST_DETAIL)
            .createQueryBuilder('O')
            .select(
                `
                VMFGNO, 
                LISTAGG(DISTINCT VORIGIN, '/') WITHIN GROUP (
                    ORDER BY CASE
                        WHEN VORIGIN = 'THAILAND' THEN 0
                        ELSE 1
                    END,
                    VORIGIN
                ) AS SHIPPINGMARK_ON_PACKAGE`,
            )
            .where('VMFGNO = :order', { order })
            .groupBy('VMFGNO')
            .getRawOne();
    }
}
