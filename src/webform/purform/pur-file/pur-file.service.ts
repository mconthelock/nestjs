import { Injectable } from '@nestjs/common';
import { CreatePurFileDto } from './dto/create-pur-file.dto';
import { SearchPurFileDto } from './dto/search-pur-file.dto';
import { PurFileRepository } from './pur-file.repository';
import { QueryHandleFileFormDto } from 'src/webform/handle-file-form/dto/search-handle-file-form.dto';

@Injectable()
export class PurFileService {
    constructor(private readonly repo: PurFileRepository) {}

    async getFile(dto: QueryHandleFileFormDto) {
        return this.repo.getFile(dto);
    }

    async getFileById(id: number) {
        return await this.repo.getFileById(id);
    }

    async insert(dto: CreatePurFileDto) {
        try {
            const res = await this.repo.insert(dto);
            if (res.identifiers.length === 0) {
                throw new Error('Insert PUR File Failed');
            }
            return {
                status: true,
                message: 'Insert PUR File Successfully',
            };
        } catch (error) {
            throw new Error('Insert PUR File Error: ' + error.message);
        }
    }

    async create(dto: CreatePurFileDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                throw new Error('Failed to insert PUR File record');
            }
            return {
                status: true,
                message: 'Insert PUR File Successfully',
                data: res,
            };
        } catch (error) {
            throw new Error('Insert PUR File Error: ' + error.message);
        }
    }

    async deleteFileByID(id: number) {
        try {
            const res = await this.repo.deleteById(id);
            if (res.affected === 0) {
                throw new Error('Delete PUR File Failed: No record deleted');
            }
            return {
                status: true,
                message: 'Delete PUR File Successfully',
            };
        } catch (error) {
            throw new Error('Delete PUR File Error: ' + error.message);
        }
    }
}
