import { Injectable } from '@nestjs/common';
import { CreateMfgFileDto } from './dto/create-mfg-file.dto';
import { UpdateMfgFileDto } from './dto/update-mfg-file.dto';
import { MfgFileRepository } from './mfg-file.repository';
import { CreateHandleFileFormDto } from 'src/webform/handle-file-form/dto/create-handle-file-form.dto';
import { QueryHandleFileFormDto } from 'src/webform/handle-file-form/dto/search-handle-file-form.dto';

@Injectable()
export class MfgFileService {
    constructor(private readonly repo: MfgFileRepository) {}
    async create(dto: CreateHandleFileFormDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                throw new Error('Failed to insert MFG File record');
            }
            return {
                status: true,
                message: 'Insert MFG File Successfully',
                data: res,
            };
        } catch (error) {
            throw new Error('Insert MFG File Error: ' + error.message);
        }
    }

    async getFile(dto: QueryHandleFileFormDto) {
        return this.repo.getFile(dto);
    }
}
