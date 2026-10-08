import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, MoreThanOrEqual } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DTIH } from 'src/common/Entities/webform/table/DTIH.entity';
import { CM_SM_FORM } from 'src/common/Entities/webform/table/CM_SM_FORM.entity';
import { UpdateCmSmDto } from './dto/update-cm-sm.dto';

@Injectable()
export class CmSmRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }

    async save(payload: UpdateCmSmDto) {
        const { TINO, REVNO, columnName, value } = payload;

        if (!TINO || !REVNO || !columnName) {
            throw new BadRequestException('TINO, REVNO and columnName are required');
        }

        const repository = this.getRepository(CM_SM_FORM);
        const allowedColumns = repository.metadata.columns.map(
            (column) => column.propertyName,
        );

        if (!allowedColumns.includes(columnName)) {
            throw new BadRequestException(`Invalid columnName: ${columnName}`);
        }

        if (columnName === 'TINO' || columnName === 'REVNO') {
            throw new BadRequestException('TINO and REVNO cannot be updated');
        }

        await repository.save({
            TINO,
            REVNO,
            [columnName]: value,
        });

        return repository.findOne({
            where: { TINO, REVNO },
        });
    }

    findAll() {
        return this.getRepository(DTIH).find({
            // where: { RECDT: MoreThanOrEqual(new Date('2026-01-01')) },
            where: { TINO: 'T-MEU-26-A0015' },
            relations: { CM_SM_FORM: true },
        });
    }
}
