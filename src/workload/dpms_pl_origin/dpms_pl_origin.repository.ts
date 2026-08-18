import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { createQueryBuilder, DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DPMS_PL_ORIGIN } from 'src/common/Entities/workload/views/DPMS_PL_ORIGIN.entity';

@Injectable()
export class DpmsPlOriginRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findById(id: number) {
        return this.getRepository(DPMS_PL_ORIGIN).find({where: { NISSUEREV_ID: id }});
    }

    findByOrder(id: number) {
        return this.getRepository(DPMS_PL_ORIGIN)
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
            .where('NISSUEREV_ID = :id', { id })
            .groupBy('VMFGNO')
            .getRawMany();
    }

    findByCase(id: number) {
        return this.getRepository(DPMS_PL_ORIGIN)
            .createQueryBuilder('O')
            .select(
                `
            VMFGNO, 
            NSEQ, 
            VCASE, 
            VPACKSTYLE, 
            NNETWEIGHT, 
            NGROSSWEIGHT, 
            VWIDTH, 
            VLENGTH, 
            VHEIGHT,
            LISTAGG(DISTINCT VORIGIN, '/') WITHIN GROUP (
                ORDER BY CASE
                    WHEN VORIGIN = 'THAILAND' THEN 0
                    ELSE 1
                END,
                VORIGIN
            ) AS SHIPPINGMARK_ON_PACKAGE`,
            )
            .where('NISSUEREV_ID = :id', { id })
            .groupBy(
                'VMFGNO, NSEQ, VCASE, VPACKSTYLE, NNETWEIGHT, NGROSSWEIGHT, VWIDTH, VLENGTH, VHEIGHT',
            )
            .orderBy('VCASE', 'ASC')
            .getRawMany();
    }

    findByDetail(id: number) {
        return this.getRepository(DPMS_PL_ORIGIN)
            .createQueryBuilder('O')
            .select(
                `
            VMFGNO,
            VCASE,
            VITEM,
            VPART,
            VDRAWING,
            VDRAWINGL,
            NQTY,
            VORIGIN`,
            )
            .where('NISSUEREV_ID = :id', { id })
            .orderBy('VCASE, VITEM, VDRAWING', 'ASC')
            .getRawMany();
    }
}
