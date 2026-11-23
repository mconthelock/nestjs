import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeepPartial } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { GPLY01_TAX } from 'src/common/Entities/webform/table/GPLY01_TAX.entiry';
import { GPLY01_TAXAS400 } from 'src/common/Entities/webform/table/GPLY01_TAXAS400.entity';
import { EMP03T } from 'src/common/Entities/webform/views/EMP03T.entity';

@Injectable()
export class GpLy01Repository extends BaseRepository {
    constructor(@InjectDataSource('mitsuConnection') ds: DataSource) {
        super(ds);
    }

    async findTaxForm(form: FormDto): Promise<GPLY01_TAX | null> {
        return this.getRepository(GPLY01_TAX).findOne({
            where: {
                NFRMNO: form.NFRMNO,
                VORGNO: form.VORGNO,
                CYEAR: form.CYEAR,
                CYEAR2: form.CYEAR2,
                NRUNNO: form.NRUNNO,
            },
        });
    }

    async findEmp03(empno: string): Promise<EMP03T | null> {
        const cleanEmpno = (empno || '').trim();

        const emp = await this.getRepository(EMP03T).findOne({
            where: { EMPCOD: cleanEmpno },
        });
        if (emp) return emp;

        return this.getRepository(EMP03T)
            .createQueryBuilder('emp03')
            .where('TRIM(emp03.EMPCOD) = :empno', { empno: cleanEmpno })
            .getOne();
    }

    async saveTaxAs400(data: DeepPartial<GPLY01_TAXAS400>): Promise<GPLY01_TAXAS400> {
        return this.getRepository(GPLY01_TAXAS400).save(data);
    }
}
