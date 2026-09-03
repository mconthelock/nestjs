import { Injectable } from '@nestjs/common';
import { CreatePurvmmFormDto } from './dto/create-purvmm_form.dto';
import { UpdatePurvmmFormDto } from './dto/update-purvmm_form.dto';
import { PurvmmFormRepository } from './purvmm_form.repository';

@Injectable()
export class PurvmmFormService {
    constructor(protected readonly repo: PurvmmFormRepository) {}

    create(createPurvmmFormDto: CreatePurvmmFormDto) {
        return this.repo.create(createPurvmmFormDto);
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
