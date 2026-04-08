import { Injectable } from '@nestjs/common';
import { CreateEbgreqattfileDto } from './dto/create-ebgreqattfile.dto';
import { UpdateEbgreqattfileDto } from './dto/update-ebgreqattfile.dto';
import { SearchEbgreqattfileDto } from './dto/search-ebgreqattfile.dto';
import { EbgreqattfileRepository } from './ebgreqattfile.repository';

@Injectable()
export class EbgreqattfileService {
    constructor(private readonly repo: EbgreqattfileRepository) {}

    findAll() {
        return this.repo.findAll();
    }

    findOne(dto: SearchEbgreqattfileDto) {
        return this.repo.findOne(dto);
    }

    find(dto: SearchEbgreqattfileDto) {
        return this.repo.find(dto);
    }

    async insert(dto: CreateEbgreqattfileDto) {
        try {
            const res = await this.repo.insert(dto);
            if (res.identifiers.length === 0) {
                throw new Error(
                    'Insert EBGREQATTFILE Error: No identifiers returned',
                );
            }
            return {
                status: true,
                message: 'Insert EBGREQATTFILE Successfully',
            };
        } catch (error) {
            throw new Error('Insert EBGREQATTFILE Error: ' + error.message);
        }
    }

    async update(dto: UpdateEbgreqattfileDto) {
        try {
            const res = await this.repo.update(dto);
            if (res.affected === 0) {
                throw new Error('Update EBGREQATTFILE Error: No rows affected');
            }
            return {
                status: true,
                data: res,
                message: 'Update EBGREQATTFILE Successfully',
            };
        } catch (error) {
            throw new Error('Update EBGREQATTFILE Error: ' + error.message);
        }
    }

    async delete(dto: UpdateEbgreqattfileDto) {
        try {
            const res = await this.repo.delete(dto);
            if (res.affected === 0) {
                throw new Error('Delete EBGREQATTFILE Error: No rows affected');
            }
            return {
                status: true,
                message: 'Delete EBGREQATTFILE Successfully',
            };
        } catch (error) {
            throw new Error('Delete EBGREQATTFILE Error: ' + error.message);
        }
    }
}
