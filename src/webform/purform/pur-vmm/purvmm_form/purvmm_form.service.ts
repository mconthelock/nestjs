import { Injectable } from '@nestjs/common';
import { CreatePurvmmFormDto } from './dto/create-purvmm_form.dto';
import { UpdatePurvmmFormDto } from './dto/update-purvmm_form.dto';
import { PurvmmFormRepository } from './purvmm_form.repository';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Injectable()
export class PurvmmFormService {
    constructor(protected readonly repo: PurvmmFormRepository) {}

    create(createPurvmmFormDto: CreatePurvmmFormDto) {
        return this.repo.create(createPurvmmFormDto);
    }

    async getData(dto: FormDto) {
        try {
            return await this.repo.getData(dto);
        } catch (error) {
            throw new Error('Get PUR-VMM Form Error: ' + error.message);
        }
    }

    findAll() {
        return `This action returns all purvmmForm`;
    }

    findOne(id: number) {
        return `This action returns a #${id} purvmmForm`;
    }

    update(id: number, updatePurvmmFormDto: UpdatePurvmmFormDto) {
        return `This action updates a #${id} purvmmForm`;
    }

    remove(id: number) {
        return `This action removes a #${id} purvmmForm`;
    }
}
