import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import * as oracledb from 'oracledb';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';
import { AmecOrdersPackNo } from 'src/common/Entities/workload/table/AMECORDERS_PACKNO.entity';
import { SearchPackingDto } from './dto/search-packing.dto';
import {
    UpdateBlockPackingDto,
    UpdateRemarkByOrderDto,
} from './dto/update-block_packing.dto';

@Injectable()
export class BlockPackingRepository extends BaseRepository {
    constructor(
        @InjectDataSource('workloadConnection') private ds: DataSource,
        @InjectDataSource('packingConnection')
        private readonly packingDs: DataSource,
        @InjectDataSource('datacenterConnection')
        private readonly datacenterDs: DataSource,
    ) {
        super(ds);
    }

    async getTRNBarcode() {
        return this.manager.query(
            `SELECT * FROM TRNBarcode where Production > '2026000'`,
        );
    }

    async getOrderMainCombine(order: string, block: string) {
        const proj = order.substring(1, 6);
        const runner = this.datacenterDs.createQueryRunner();
        await runner.connect();

        try {
            const connection = (runner as any)
                .databaseConnection as oracledb.Connection;
            const result = await connection.execute(
                `DECLARE
                    v_cursor SYS_REFCURSOR;
                BEGIN
                    SP_GET_ORDER_MAIN_COMBINE(
                        p_s03k01 => '${order}',
                        p_search => '${proj}',
                        p_s03k02 => '${block}',
                        p_cursor => v_cursor
                    );

                    DBMS_SQL.RETURN_RESULT(v_cursor);
                END;`,
                {},
                {
                    outFormat: oracledb.OUT_FORMAT_OBJECT,
                    resultSet: true,
                },
            );

            const rows = [];
            for (const resultSet of result.implicitResults ?? []) {
                rows.push(...(await resultSet.getRows()));
                await resultSet.close();
            }

            return rows;
        } finally {
            await runner.release();
        }
    }

    async getDataCartonBox() {
        return this.ds.query(`
            SELECT * FROM PKC_CARTON_DETAIL WHERE STATUS = 1
        `);
    }

    async getS010KP() {
        return this.ds.query(`
            SELECT * FROM S010MP
        `);
    }

    async getPisPages(searchDto: SearchPackingDto) {
        const qb = this.ds
            .createQueryBuilder(AmecOrdersPackNo, 'packing')
            .leftJoinAndSelect('packing.detail', 'detail')
            .leftJoinAndSelect('detail.schedule', 'schedule')
            .leftJoinAndSelect('packing.printed', 'printed');
        await applyDynamicFilters(qb, searchDto, 'packing');
        return qb.getMany();
    }

    async updateRemarkPacking(dto: UpdateBlockPackingDto) {
        return this.ds.query(
            `UPDATE AMECORDERS_PACKNO
             SET REMARK = :1
             WHERE ORDERNO = :2 AND PACKNO = :3`,
            [dto.REMARK, dto.ORDERNO, dto.PACKNO],
        );
    }

    async updateRemarkByOrder(dto: UpdateRemarkByOrderDto) {
        const orderBinds = dto.ORDERSNO.map((_, index) => `:${index + 2}`);

        return this.ds.query(
            `UPDATE AMECORDERS_PACKNO
             SET REMARK = :1
             WHERE ORDERNO IN (${orderBinds.join(', ')})`,
            [dto.REMARK, ...dto.ORDERSNO],
        );
    }
}
