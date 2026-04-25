import { Injectable } from '@nestjs/common';
import { OracleRepository } from 'src/common/repositories/oracle-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { SaveDto } from './dto/save.dto';

@Injectable()
export class ChecksheetRepository extends OracleRepository {
    constructor(
        @InjectDataSource('escsConnection')
        ds: DataSource,
    ) {
        super(ds);
    }

    /**
     * IN_CHECK procedure
     */
    getInCheck(dto: any) {
        return this.execCursor(
            'IN_CHECK',
            dto,
            ['prod', 'order', 'item', 'dwgid', 'reg', 'user'],
        );
    }

    /**
     * SAVE procedure
     */
    saveAction(procName: string, dto: SaveDto) {
        return this.execProcedure(
            procName,
            dto,
            ['prod', 'order', 'item', 'dwgid', 'user'],
        );
    }
}