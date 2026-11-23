import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { GPLY01_TAX } from 'src/common/Entities/webform/table/GPLY01_TAX.entiry';

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
}
