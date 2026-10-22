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

    async deleteFileByID(id: number) {
        try {
            const res = await this.repo.deleteById(id);
            if (res.affected === 0) {
                throw new Error('Delete GP File Failed: No record deleted');
            }
            return {
                status: true,
                message: 'Delete GP File Successfully',
            };
        } catch (error) {
            throw new Error('Delete GP File Error: ' + error.message);
        }
    }
}
