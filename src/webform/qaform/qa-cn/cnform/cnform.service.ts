import { Injectable } from '@nestjs/common';
import { CreateCnformDto } from './dto/create-cnform.dto';
import { UpdateCnformDto } from './dto/update-cnform.dto';
import { CnFormRepository } from './cnform.repository';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Injectable()
export class CnformService {
    constructor(private readonly repo: CnFormRepository) {}
    async create(dto: CreateCnformDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                throw new Error('Failed to insert CNFORM');
            }
            return {
                status: true,
                message: 'Insert CNFORM Successfully',
            };
        } catch (error) {
            throw new Error('Insert CNFORM Error: ' + error.message);
        }
    }

    findAll() {
        return `This action returns all cnForm`;
    }

    findOne(id: number) {
        return `This action returns a #${id} cnForm`;
    }

    async update(con: FormDto, dto: UpdateCnformDto) {
        try {
            const res = await this.repo.update(con, dto);
            if (!res) {
                throw new Error('Failed to update CNFORM');
            }
            return {
                status: true,
                message: 'Update CNFORM Successfully',
            };
        } catch (error) {
            throw new Error('Update CNFORM Error: ' + error.message);
        }
    }

    remove(id: number) {
        return `This action removes a #${id} cnForm`;
    }
}
