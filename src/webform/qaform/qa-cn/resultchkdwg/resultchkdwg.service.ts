import { Injectable } from '@nestjs/common';
import { CreateResultchkdwgDto } from './dto/create-resultchkdwg.dto';
import { UpdateResultchkdwgDto } from './dto/update-resultchkdwg.dto';
import { ResultChkDwgRepository } from './resultchkdwg.repository';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Injectable()
export class ResultChkDwgService {
    constructor(private readonly repo: ResultChkDwgRepository) {}
    async create(dto: CreateResultchkdwgDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                throw new Error('Failed to insert RESULTCHKDWG');
            }
            return {
                status: true,
                message: 'Insert RESULTCHKDWG Successfully',
            };
        } catch (error) {
            throw new Error('Insert RESULTCHKDWG Error: ' + error.message);
        }
    }

    async insertMultiple(dtos: CreateResultchkdwgDto[]) {
        try {
            const res = await this.repo.insertMultiple(dtos);
            if (!res) {
                throw new Error('Failed to insert RESULTCHKDWG');
            }
            return {
                status: true,
                message: 'Insert RESULTCHKDWG Successfully',
            };
        } catch (error) {
            throw new Error('Insert RESULTCHKDWG Error: ' + error.message);
        }
    }

    findAll() {
        return `This action returns all cnForm`;
    }

    findOne(id: number) {
        return `This action returns a #${id} cnForm`;
    }

    async updateMultiple(con: FormDto, dtos: UpdateResultchkdwgDto[]) {
        try {
            const res = await this.repo.updateMultiple(con, dtos);
            if (!res) {
                throw new Error('Failed to update RESULTCHKDWG');
            }
            return {
                status: true,
                message: 'Update RESULTCHKDWG Successfully',
            };
        } catch (error) {
            throw new Error('Update RESULTCHKDWG Error: ' + error.message);
        }
    }

    remove(id: number) {
        return `This action removes a #${id} cnForm`;
    }
}
