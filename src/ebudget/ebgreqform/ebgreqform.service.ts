import { Injectable } from '@nestjs/common';
import { CreateEbgreqformDto } from './dto/create-ebgreqform.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { EbgreqformRepository } from './ebgreqform.repository';

@Injectable()
export class EbgreqformService {
    constructor(private readonly repo: EbgreqformRepository) {}

    async findOne(form: FormDto) {
        return this.repo.findOne(form);
    }

    async create(dto: CreateEbgreqformDto) {
        try {
            const res = await this.repo.create(dto);
            if(!res){
                throw new Error('Failed to insert EBGREQFORM');
            }
            return {
                status: true,
                message: 'Insert EBGREQFORM Successfully',
            };
        } catch (error) {
            throw new Error('Insert EBGREQFORM Error: ' + error.message);
        }
    }
}
