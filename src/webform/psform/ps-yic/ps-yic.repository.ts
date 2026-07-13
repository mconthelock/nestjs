import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PSYIC_FORM } from 'src/common/Entities/webform/table/PSYIC_FORM.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class PsYicRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }

    async getFormData(dto: FormDto){
        return this.getRepository(PSYIC_FORM).find({
            where: {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO
            },
            relations: { RESULT: true , ASSIGN: true},
        });
    }
}
