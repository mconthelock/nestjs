import { Injectable } from '@nestjs/common';
import { OracleRepository } from 'src/common/repositories/oracle-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { SaveDto } from './dto/save.dto';
import { GetOrderDto } from './dto/get-order.dto';
import { InCheckDto } from './dto/in-check.dto';
import { ChecksheetProc } from './enums/proc.enum';

@Injectable()
export class ChecksheetRepository extends OracleRepository {
    constructor(
        @InjectDataSource('escsConnection')
        ds: DataSource,
    ) {
        super(ds);
    }

    async getOrder(dto: GetOrderDto): Promise<any[]> {
        const sql = `
            SELECT TYPE_MODEL,
                   CASE 
                       WHEN ORT_ID = 5 THEN ORDER_ID 
                       ELSE ORD_NO 
                   END AS ORDERNO
            FROM GET_ORDER
            WHERE ORD_PRODUCTION = :prod
              AND ORD_NO = :mfgno
              AND ORD_ITEM = :item
              AND ORDDW_ID = :dwgId
        `;

        return this.query(sql, { prod: dto.prod, mfgno: dto.order, item: dto.item, dwgId: dto.dwgId });
    }

    async getInCheck(dto: InCheckDto): Promise<any[]> {
        return this.execCursor(
            ChecksheetProc.IN_CHECK,
            dto,
            ['prod', 'order', 'item', 'dwgId', 'reg', 'user']
        );
    }

    async saveAction(procName: ChecksheetProc, dto: SaveDto): Promise<void> {
        return this.execProcedure(
            procName,
            dto,
            ['prod', 'order', 'item', 'dwgId', 'user']
        );
    }
}