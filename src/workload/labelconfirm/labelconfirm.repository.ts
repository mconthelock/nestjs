import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { KITTING_EVENT_LOG } from 'src/common/Entities/workload/views/V_KITTING_EVENT_LOG.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class LabelconfirmRepository extends BaseRepository {
    constructor(
        @InjectDataSource('workloadConnection') private ds: DataSource,
    ) {
        super(ds);
    }

    async getLabelList(order: string, packing: string) {
        const sql = `
            SELECT kl.*
            FROM KITTING_LABEL kl          
            WHERE kl.ORDER_NO LIKE :1
            AND kl.PACKING_NO = :2
        `;

        return await this.ds.query(sql, [`_${order}_`, packing]);
    }

    async confirm(qrCode: string, empno: string) {
        const sql = `
            UPDATE KITTING_LABEL
            SET PRINT_STATUS = 2,
                CONFIRM_BY = :1,
                CONFIRM_AT = SYSDATE
            WHERE QR_CODE = :2
        `;

        return await this.ds.query(sql, [empno, qrCode]);
    }

    async errLog(
        order: string,
        packing: string,
        qrCode: string,
        empno: string,
    ) {
        const sql = `
            INSERT INTO KIT_ERR_LOG (ORDER_NO, PACKING_NO, QR_ERR, CREATE_BY, CREATE_AT)
            VALUES (:1, :2, :3, :4, SYSDATE)
        `;
        return await this.ds.query(sql, [order, packing, qrCode, empno]);
    }

    async getKittingLabelHistory() {
        return this.getRepository(KITTING_EVENT_LOG).find({
            relations: {
                KITTINGLABEL: true,
            },
        });
    }
}
