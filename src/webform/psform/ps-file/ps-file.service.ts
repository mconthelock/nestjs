import { Injectable } from '@nestjs/common';
import { CreatePsFileDto } from './dto/create-ps-file.dto';
import { UpdatePsFileDto } from './dto/update-ps-file.dto';
import { PsFileRepository } from './ps-file.repository';
import { CreateHandleFileFormDto } from 'src/webform/center/handle-file-form/dto/create-handle-file-form.dto';
import {
    QueryHandleFileFormDto,
    SearchHandleFileFormDto,
} from 'src/webform/center/handle-file-form/dto/search-handle-file-form.dto';

@Injectable()
export class PsFileService {
    constructor(private readonly repo: PsFileRepository) {}
    async create(dto: CreateHandleFileFormDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                throw new Error('Failed to insert PS File record');
            }
            return {
                status: true,
                message: 'Insert PS File Successfully',
                data: res,
            };
        } catch (error) {
            throw new Error('Insert PS File Error: ' + error.message);
        }
    }

    async getFile(dto: QueryHandleFileFormDto) {
        return this.repo.getFile(dto);
    }
}
