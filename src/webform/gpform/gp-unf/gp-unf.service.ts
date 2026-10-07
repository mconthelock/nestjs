import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { GPUNF_FORM } from 'src/common/Entities/webform/table/GPUNF_FORM.entity';
import { SearchGpUnfDto } from './dto/search-gp-unf.dto';

@Injectable()
export class GpUnfService {
    constructor(
        @InjectRepository(GPUNF_FORM, 'webformConnection')
        private readonly form: Repository<GPUNF_FORM>,
    ) {}

    async search(q: SearchGpUnfDto) {
        const qb = await this.form
            .createQueryBuilder('unfform')
            .leftJoinAndSelect('unfform.details', 'unfdetails')
            .leftJoinAndSelect('unfdetails.uniform', 'uniform')
            .leftJoinAndSelect('uniform.category', 'category')
            .leftJoinAndSelect('unfdetails.olduniform', 'olduniform')
            .leftJoinAndSelect('olduniform.category', 'oldcategory')
            .leftJoinAndSelect('unfform.form', 'form')
            .leftJoinAndSelect('form.formmst', 'formmst')
            .leftJoinAndSelect('unfform.requestType', 'requestType');
        await applyDynamicFilters(qb, q, 'unfform');
        return qb.getMany();
    }
}
