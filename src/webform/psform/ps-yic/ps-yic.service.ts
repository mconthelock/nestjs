import { Injectable } from '@nestjs/common';
import { PsYicRepository } from './ps-yic.repository';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Injectable()
export class PsYicService {
    constructor(private readonly psYicRepository: PsYicRepository) {}

    async getFormData(dto: FormDto) {
        return this.psYicRepository.getFormData(dto);
    }
}
