import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BENEFICIARY } from 'src/common/Entities/gpreport/table/BENEFICIARY.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class BeneficiaryRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }

    getDetail(id: string) {
        return this.getRepository(BENEFICIARY).find({
            where: { SEMPNO: id },
        });
    }
}
