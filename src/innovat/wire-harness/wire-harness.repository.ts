import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';

@Injectable()
export class WireHarnessRepository extends BaseRepository {
    constructor(
        @InjectDataSource('innovatConnection')
        private readonly ds: DataSource,
    ) {
        super(ds);
    }

    async deleteProductionPlan() {
        return this.ds.query(`
            DELETE FROM WHN_PRODUCTION_PLAN
        `);
    }

    async insertProductionPlan(data: any[]) {
        for (const row of data) {
            await this.ds.query(
                `
                INSERT INTO WHN_PRODUCTION_PLAN (
                    CTRLNO,
                    PROCESS,
                    PROD,
                    P,
                    MFGNO,
                    PROJ,
                    MODEL,
                    DWG,
                    QTY,
                    MATERIAL,
                    ITEMCODE,
                    CUT,
                    REMARK
                )
                VALUES (
                    :1,:2,:3,:4,:5,:6,:7,:8,:9,:10,:11,:12,:13
                )
                `,
                [
                    row.CTRLNO,
                    row.PROCESS,
                    row.PROD,
                    row.P,
                    row.MFGNO,
                    row.PROJ,
                    row.MODEL,
                    row.DWG,
                    row.QTY,
                    row.MATERIAL,
                    row.ITEMCODE,
                    row.CUT,
                    row.REMARK,
                ],
            );
        }
    }

    async getProductionPlan() {
        return this.ds.query(`
            SELECT *
            FROM VW_AUTOPLAN
        `);
    }

    // findByName(name: string) {
    //     return this.getRepository(MACHINE_NAME).findOne({
    //         where: {
    //             MC_NAME: name
    //         },
    //     });
    // }
}