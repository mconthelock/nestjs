import { Injectable } from '@nestjs/common';
import { CreateFeFileDto } from './dto/create-fe-file.dto';
import { UpdateFeFileDto } from './dto/update-fe-file.dto';
import { CreateHandleFileFormDto } from 'src/webform/center/handle-file-form/dto/create-handle-file-form.dto';
import { FeFileRepository } from './fe-file.repository';
import { QueryHandleFileFormDto } from 'src/webform/center/handle-file-form/dto/search-handle-file-form.dto';

@Injectable()
export class FeFileService {
    constructor(private readonly repo: FeFileRepository) {}
    async create(dto: CreateHandleFileFormDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                throw new Error('Failed to insert FE File record');
            }
            return {
                status: true,
                message: 'Insert FE File Successfully',
                data: res,
            };
        } catch (error) {
            throw new Error('Insert FE File Error: ' + error.message);
        }
    }

    async getFile(dto: QueryHandleFileFormDto) {
        return this.repo.getFile(dto);
    }
}
