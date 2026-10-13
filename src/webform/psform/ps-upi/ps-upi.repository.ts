import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, In } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { PSUPI_REQUISITION } from 'src/common/Entities/webform/table/PSUPI_REQUISITION.entity';
import { PSUPI_REASON } from 'src/common/Entities/webform/table/PSUPI_REASON.entity';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { SearchReportDto } from './dto/search-report.dto';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { FORMMST } from 'src/common/Entities/webform/table/FORMMST.entity';
import { User } from 'src/common/Entities/webform/views/AMECUSERALL.entity';

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
        const rows = await this.getRepository(PSUPI_REQUISITION).find({
            where: {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            },
            relations: { form: { flow: true } },
        });

        if (rows.length === 0) {
            return rows;
        }

        const reasonCodes = [...new Set(rows.map((row) => row.REASON_CODE))];
        const reasons = await this.getRepository(PSUPI_REASON).find({
            where: { REASON_CODE: In(reasonCodes) },
        });
        const reasonNames = new Map(
            reasons.map((reason) => [reason.REASON_CODE, reason.REASON_NAME]),
        );

        return rows.map((row) => ({
            ...row,
            REASON_NAME: reasonNames.get(row.REASON_CODE) ?? null,
        }));
    }

    async getReport(dto: SearchReportDto) {
        const formmst = await this.getRepository(FORMMST).findOneBy({
            VANAME: 'PS-UPI',
        });
        // return this.getRepository(FORM)
        //     .createQueryBuilder('F')
        //     .select('F.*,REQ.*')
        //     .addSelect('REQ.SNAME', 'VREQNAME')
        //     .leftJoin(User, 'REQ', 'REQ.SEMPNO = F.VREQNO')
        //     .where('F.NFRMNO = :NFRMNO', { NFRMNO: formmst.NNO })
        //     .andWhere('F.VORGNO = :VORGNO', { VORGNO: formmst.VORGNO })
        //     .andWhere('F.CYEAR = :CYEAR', { CYEAR: formmst.CYEAR })
        //     .andWhere(dto)
        //     .getRawMany();

        // const rows = await this.getRepository(PSUPI_REQUISITION).find({
        //     where: {
        //         NFRMNO: formmst.NNO,
        //         VORGNO: formmst.VORGNO,
        //         CYEAR: formmst.CYEAR
        //     }
        // });

        const query = this.getRepository(PSUPI_REQUISITION)
            .createQueryBuilder('REQ')
            .select('REQ.*,WHI_USER.SNAME as WHI_USER_NAME')
            .leftJoin(User, 'WHI_USER', 'WHI_USER.SEMPNO = REQ.WHI_USER')
            .leftJoin(FORM, 'F', 'F.NFRMNO = REQ.NFRMNO AND F.VORGNO = REQ.VORGNO AND F.CYEAR = REQ.CYEAR AND F.CYEAR2 = REQ.CYEAR2 AND F.NRUNNO = REQ.NRUNNO')
            .where('REQ.NFRMNO = :NFRMNO', { NFRMNO: formmst.NNO })
            .andWhere('REQ.VORGNO = :VORGNO', { VORGNO: formmst.VORGNO })
            .andWhere('REQ.CYEAR = :CYEAR', { CYEAR: formmst.CYEAR });

        if (dto.CST) {
            query.andWhere('F.CST = :CST', { CST: dto.CST });
        }
        if (dto.VREQNO) {
            query.andWhere('F.VREQNO = :VREQNO', { VREQNO: dto.VREQNO });
        }
        if (dto.DREQDATE) {
            query.andWhere('F.DREQDATE = :DREQDATE', { DREQDATE: dto.DREQDATE });
        }

        const rows = await query.getRawMany();

        return rows;
    }
}
