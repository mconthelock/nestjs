import { Injectable } from '@nestjs/common';
import { CreateMarFileDto } from './dto/create-mar-file.dto';
import { UpdateMarFileDto } from './dto/update-mar-file.dto';
import { MarFileRepository } from './mar-file.repository';
import { CreateHandleFileFormDto } from 'src/webform/handle-file-form/dto/create-handle-file-form.dto';
import { QueryHandleFileFormDto } from 'src/webform/handle-file-form/dto/search-handle-file-form.dto';

@Injectable()
export class MarFileService {
    constructor(private readonly repo: MarFileRepository) {}
    async create(dto: CreateHandleFileFormDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                throw new Error('Failed to insert MAR File record');
            }
            return {
                status: true,
                message: 'Insert MAR File Successfully',
                data: res,
            };
        } catch (error) {
            throw new Error('Insert MAR File Error: ' + error.message);
        }
    }

    async getFile(dto: QueryHandleFileFormDto) {
        return this.repo.getFile(dto);
    }
}
