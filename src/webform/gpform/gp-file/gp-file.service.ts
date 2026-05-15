import { Injectable } from '@nestjs/common';
import { CreateHandleFileFormDto } from 'src/webform/handle-file-form/dto/create-handle-file-form.dto';
import { GpFileRepository } from './gp-file.repository';
import { QueryHandleFileFormDto } from 'src/webform/handle-file-form/dto/search-handle-file-form.dto';

@Injectable()
export class GpFileService {
    constructor(private readonly repo: GpFileRepository) {}
    async create(dto: CreateHandleFileFormDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                throw new Error('Failed to insert GP File record');
            }
            return {
                status: true,
                message: 'Insert GP File Successfully',
                data: res,
            };
        } catch (error) {
            throw new Error('Insert GP File Error: ' + error.message);
        }
    }

    async getFile(dto: QueryHandleFileFormDto) {
        return this.repo.getFile(dto);
    }
}
