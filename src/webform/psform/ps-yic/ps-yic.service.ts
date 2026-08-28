import { Injectable } from '@nestjs/common';
import { PsYicRepository } from './ps-yic.repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { INV_YEARLY_RESULT } from 'src/common/Entities/skid/table/INV_YEARLY_RESULT.entity';
import { FindOptionsWhere, QueryDeepPartialEntity } from 'typeorm';
import { PSYIC_FORM } from 'src/common/Entities/webform/table/PSYIC_FORM.entity';

@Injectable()
export class PsYicService {
    constructor(private readonly psYicRepository: PsYicRepository) {}

    async getFormData(dto: FormDto) {
        return this.psYicRepository.getFormData(dto);
    }

    async updateYearlyResult(
        where: FindOptionsWhere<INV_YEARLY_RESULT>,
        data: QueryDeepPartialEntity<INV_YEARLY_RESULT>,
    ) {
        return this.psYicRepository.updateYearlyResult(where, data);
    }

    async updateFormData(
        where: FindOptionsWhere<PSYIC_FORM>,
        data: QueryDeepPartialEntity<PSYIC_FORM>,
    ) {
        return this.psYicRepository.updateFormData(where, data);
    }
}
