import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { PSUPI_REQUISITION } from 'src/common/Entities/webform/table/PSUPI_REQUISITION.entity';
import { PSUPI_REASON } from 'src/common/Entities/webform/table/PSUPI_REASON.entity';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { SearchReportDto } from './dto/search-report.dto';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { FORMMST } from 'src/common/Entities/webform/table/FORMMST.entity';

@Injectable()
export class PsUpiRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }

    async getReason() {
        return this.manager
            .createQueryBuilder()
            .select('*')
            .from('PSUPI_REASON', 'r')
            .where('ACTIVE = :active', { active: 1 })
            .getRawMany();
    }

    async insertList(rows: Record<string, unknown>[]) {
        if (rows.length === 0) {
            return [];
        }

        return this.manager
            .createQueryBuilder()
            .insert()
            .into(PSUPI_REQUISITION)
            .values(rows)
            .execute();
    }

    async replaceList(form: FormDto, rows: Record<string, unknown>[]) {
        await this.manager
            .createQueryBuilder()
            .delete()
            .from(PSUPI_REQUISITION)
            .where('NFRMNO = :NFRMNO', { NFRMNO: form.NFRMNO })
            .andWhere('VORGNO = :VORGNO', { VORGNO: form.VORGNO })
            .andWhere('CYEAR = :CYEAR', { CYEAR: form.CYEAR })
            .andWhere('CYEAR2 = :CYEAR2', { CYEAR2: form.CYEAR2 })
            .andWhere('NRUNNO = :NRUNNO', { NRUNNO: form.NRUNNO })
            .execute();

        return this.insertList(rows);
    }

    async getDataForm(dto: FormDto) {
        return this.getRepository(PSUPI_REQUISITION)
            .createQueryBuilder('R')
            .select('R.*')
            .addSelect('reason.REASON_NAME', 'REASON_NAME')
            .leftJoin(
                PSUPI_REASON,
                'reason',
                'reason.REASON_CODE = R.REASON_CODE',
            )
            .where('R.NFRMNO = :NFRMNO', { NFRMNO: dto.NFRMNO })
            .andWhere('R.VORGNO = :VORGNO', { VORGNO: dto.VORGNO })
            .andWhere('R.CYEAR = :CYEAR', { CYEAR: dto.CYEAR })
            .andWhere('R.CYEAR2 = :CYEAR2', { CYEAR2: dto.CYEAR2 })
            .andWhere('R.NRUNNO = :NRUNNO', { NRUNNO: dto.NRUNNO })
            .getRawMany();
    }

    async getReport(dto: SearchReportDto) {
        const formmst = await this.getRepository(FORMMST).findOneBy({
            VANAME: 'PS-UPI',
        });
        return this.getRepository(FORM).find({
            where: {
                NFRMNO: formmst.NNO,
                VORGNO: formmst.VORGNO,
                CYEAR: formmst.CYEAR,
            },
        });
    }
}
