import { Injectable } from '@nestjs/common';
import { OracleRepository } from 'src/common/repositories/oracle-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { SaveDto } from './dto/save.dto';
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

    async getInCheck(dto: InCheckDto): Promise<any[]> {
        const paramOrder = ['prod', 'order', 'item', 'dwgId', 'reg', 'user'];
        return this.execCursor(
            ChecksheetProc.IN_CHECK,
            dto,
            paramOrder
        );
    }

    async saveAction(procName: ChecksheetProc, dto: SaveDto): Promise<void> {
        const paramOrder = ['prod', 'order', 'item', 'dwgId', 'user'];
        return this.execProcedure(
            procName,
            dto,
            paramOrder
        );
    }
}