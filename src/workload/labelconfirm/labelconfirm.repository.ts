import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
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
            INNER JOIN S010MP s
                ON kl.ORDER_NO = s.S01M01
            AND kl.PACKING_NO = s.S01M04
            WHERE s.S01M01 LIKE :1
            AND s.S01M04 = :2
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
}
