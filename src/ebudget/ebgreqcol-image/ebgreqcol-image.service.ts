import { Injectable } from '@nestjs/common';
import { CreateEbgreqcolImageDto } from './dto/create-ebgreqcol-image.dto';
import { UpdateEbgreqcolImageDto } from './dto/update-ebgreqcol-image.dto';
import { EBGREQCOL_IMAGE } from 'src/common/Entities/ebudget/table/EBGREQCOL_IMAGE.entity';
import { SearchEbgreqcolImageDto } from './dto/search-ebgreqcol-image.dto';
import { EbgreqcolImageRepository } from './ebgreqcol-image.repository';

@Injectable()
export class EbgreqcolImageService {
    constructor(private readonly repo: EbgreqcolImageRepository) {}

    findAll() {
        return this.repo.findAll();
    }

    findOne(dto: SearchEbgreqcolImageDto) {
        return this.repo.findOne(dto);
    }

    find(dto: SearchEbgreqcolImageDto) {
        return this.repo.find(dto);
    }

    async insert(dto: CreateEbgreqcolImageDto) {
        try {
            const res = await this.repo.insert(dto);
            if (res.identifiers.length === 0) {
                throw new Error(
                    'Insert EBGREQCOL_IMAGE Error: No identifiers returned',
                );
            }
            return {
                status: true,
                message: 'Insert EBGREQCOL_IMAGE Successfully',
            };
        } catch (error) {
            throw new Error('Insert EBGREQCOL_IMAGE Error: ' + error.message);
        }
    }

    async update(dto: UpdateEbgreqcolImageDto) {
        try {
            const res = await this.repo.update(dto);
            if (res.affected === 0) {
                throw new Error(
                    'Update EBGREQCOL_IMAGE Error: No rows affected',
                );
            }
            return {
                status: true,
                data: res,
                message: 'Update EBGREQCOL_IMAGE Successfully',
            };
        } catch (error) {
            throw new Error('Update EBGREQCOL_IMAGE Error: ' + error.message);
        }
    }

    async delete(dto: UpdateEbgreqcolImageDto) {
        try {
            const res = await this.repo.delete(dto);
            if (res.affected === 0) {
                throw new Error(
                    'Delete EBGREQCOL_IMAGE Error: No rows affected',
                );
            }
            return {
                status: true,
                message: 'Delete EBGREQCOL_IMAGE Successfully',
            };
        } catch (error) {
            throw new Error('Delete EBGREQCOL_IMAGE Error: ' + error.message);
        }
    }
}
