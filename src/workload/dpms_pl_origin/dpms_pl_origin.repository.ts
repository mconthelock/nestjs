import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DPMS_PL_ORIGIN_VIEW } from 'src/common/Entities/workload/views/DPMS_PL_ORIGIN_VIEW.entity';
import { CreateDpmsPlOriginDto } from './dto/create-dpms_pl_origin.dto';
import { DPMS_PL_ORIGIN } from 'src/common/Entities/workload/table/DPMS_PL_ORIGIN.entity';

@Injectable()
export class DpmsPlOriginRepository extends BaseRepository {
    constructor(@InjectDataSource('workloadConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    getOriginById(id: number) {
        return this.getRepository(DPMS_PL_ORIGIN_VIEW).find({
            where: { NISSUEREV_ID: id },
            order: { NSEQ: 'ASC', VCASE: 'ASC', VITEM: 'ASC', VDRAWING: 'ASC' },
        });
    }

    getOrderOrigin(order: string) {
        return this.getRepository(DPMS_PL_ORIGIN_VIEW)
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
            .where('VMFGNO = :order AND LAST_REVISION = 1', { order })
            .groupBy('VMFGNO')
            .getRawOne();
    }

    getCaseOrigin(order: string) {
        return this.getRepository(DPMS_PL_ORIGIN_VIEW)
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
            .where('VMFGNO = :order AND LAST_REVISION = 1', { order })
            .groupBy(
                'VMFGNO, NSEQ, VCASE, VPACKSTYLE, NNETWEIGHT, NGROSSWEIGHT, VWIDTH, VLENGTH, VHEIGHT',
            )
            .orderBy('VCASE', 'ASC')
            .getRawMany();
    }

    getDetailOrigin(order: string) {
        return this.getRepository(DPMS_PL_ORIGIN_VIEW)
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
            .where('VMFGNO = :order AND LAST_REVISION = 1', { order })
            .orderBy('VCASE, VITEM, VDRAWING', 'ASC')
            .getRawMany();
    }

    create(data: CreateDpmsPlOriginDto | CreateDpmsPlOriginDto[]) {
        if (Array.isArray(data)) {
            return this.getRepository(DPMS_PL_ORIGIN).save(data, {
                chunk: 500, // แบ่งการบันทึกเป็นกลุ่มละ 500 แถว
            });
        }
        return this.getRepository(DPMS_PL_ORIGIN).save(data);
    }
}
