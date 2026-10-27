import { Injectable } from '@nestjs/common';
import { CreateIetsFormDto } from './dto/create-iets_form.dto';
import { UpdateIetsFormDto } from './dto/update-iets_form.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { IetsFormRepository } from './iets_form.repository';

@Injectable()
export class IetsFormService {
    constructor(private readonly repo: IetsFormRepository) {}
    async getData(dto: FormDto) {
        try {
            return await this.repo.getData(dto);
        } catch (error) {
            throw new Error('Get IE-TS Form Error: ' + error.message);
        }
    }
    create(createIetsFormDto: CreateIetsFormDto) {
        return 'This action adds a new ietsForm';
    }

    findAll() {
        return `This action returns all ietsForm`;
    }

    findOne(id: number) {
        return `This action returns a #${id} ietsForm`;
    }

    update(id: number, updateIetsFormDto: UpdateIetsFormDto) {
        return `This action updates a #${id} ietsForm`;
    }

    remove(id: number) {
        return `This action removes a #${id} ietsForm`;
    }
}
