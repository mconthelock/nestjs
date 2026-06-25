import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { INV_CHECK_ASSIGN } from 'src/common/Entities/skid/table/INV_CHECK_ASSIGN.entity';
import { INV_HALFYEAR_RESULT } from 'src/common/Entities/skid/table/INV_HALFYEAR_RESULT.entity';
import { PSVAR_FORM } from 'src/common/Entities/webform/table/PSVAR_FORM.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class PsVarRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }

    async getDataResult(reportID: number) {
        return await this.getRepository(INV_HALFYEAR_RESULT)
            .createQueryBuilder('ihr')
            .leftJoinAndSelect('ihr.ITEM_DETAIL', 'ii')
            .leftJoinAndMapOne(
                'ihr.ASSIGN_DETAIL',
                INV_CHECK_ASSIGN,
                'assign',
                'assign.ID = ihr.SOURCE_ASSIGN_ID',
            )
            .where('ihr.REPORT_ID = :reportID', { reportID })
            .getMany();
    }

    async getDataResult2(dto: FormDto) {
        const sql = `SELECT 
            pf.*,
            pf2.NFRMNO AS CIH_NFRMNO,
            pf2.VORGNO AS CIH_VORGNO,
            pf2.CYEAR AS CIH_CYEAR,
            pf2.CYEAR2 AS CIH_CYEAR2,
            pf2.NRUNNO AS CIH_NRUNNO,
            ihr.*,
            ica.*
        FROM PSVAR_FORM pf
        JOIN PSCIH_FORM pf2 ON pf.REPORT_ID = pf2.REPORT_ID 
        JOIN SKIDCNTRL.INV_HALFYEAR_RESULT ihr ON pf.REPORT_ID = ihr.REPORT_ID 
        JOIN SKIDCNTRL.INV_CHECK_ASSIGN ica ON ihr.SOURCE_ASSIGN_ID = ica.ID
        WHERE pf.NFRMNO = :1 AND pf.VORGNO = :2 AND pf.CYEAR = :3 AND pf.CYEAR2 = :4 AND pf.NRUNNO = :5`;
        return await this.manager.query(sql, [dto.NFRMNO, dto.VORGNO, dto.CYEAR, dto.CYEAR2, dto.NRUNNO]);
    }

    async insert_psvar_form(data: any) {
        return this.getRepository(PSVAR_FORM).save(data);
    }
}
