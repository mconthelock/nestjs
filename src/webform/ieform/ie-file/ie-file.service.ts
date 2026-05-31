import { Injectable } from '@nestjs/common';
import { CreateIeFileDto } from './dto/create-ie-file.dto';
import { UpdateIeFileDto } from './dto/update-ie-file.dto';
import { IeFileRepository } from './ie-file.repository';
import { CreateHandleFileFormDto } from 'src/webform/center/handle-file-form/dto/create-handle-file-form.dto';
import { QueryHandleFileFormDto } from 'src/webform/center/handle-file-form/dto/search-handle-file-form.dto';

@Injectable()
export class IeFileService {
    constructor(private readonly repo: IeFileRepository) {}
    async create(dto: CreateHandleFileFormDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                throw new Error('Failed to insert IE File record');
            }
            return {
                status: true,
                message: 'Insert IE File Successfully',
                data: res,
            };
        } catch (error) {
            throw new Error('Insert IE File Error: ' + error.message);
        }
    }

    async getFile(dto: QueryHandleFileFormDto) {
        return this.repo.getFile(dto);
    }
}
