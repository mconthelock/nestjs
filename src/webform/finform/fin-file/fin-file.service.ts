import { Injectable } from '@nestjs/common';
import { CreateFinFileDto } from './dto/create-fin-file.dto';
import { UpdateFinFileDto } from './dto/update-fin-file.dto';
import { FinFileRepository } from './fin-file.repository';
import { CreateHandleFileFormDto } from 'src/webform/handle-file-form/dto/create-handle-file-form.dto';
import { QueryHandleFileFormDto } from 'src/webform/handle-file-form/dto/search-handle-file-form.dto';

@Injectable()
export class FinFileService {
    constructor(private readonly repo: FinFileRepository) {}
    async create(dto: CreateHandleFileFormDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                throw new Error('Failed to insert Fin File record');
            }
            return {
                status: true,
                message: 'Insert Fin File Successfully',
                data: res,
            };
        } catch (error) {
            throw new Error('Insert Fin File Error: ' + error.message);
        }
    }

    async getFile(dto: QueryHandleFileFormDto) {
        return this.repo.getFile(dto);
    }
}
