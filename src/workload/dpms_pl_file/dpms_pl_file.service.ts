import { Injectable } from '@nestjs/common';
import { CreateDpmsPlFileDto } from './dto/create-dpms_pl_file.dto';
import { UpdateDpmsPlFileDto } from './dto/update-dpms_pl_file.dto';
import { DpmsPlFileRepository } from './dpms_pl_file.repository';

@Injectable()
export class DpmsPlFileService {
    constructor(private readonly repo: DpmsPlFileRepository) {}

    async create(dto: CreateDpmsPlFileDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                throw new Error('Failed to insert packing list file record');
            }
            return {
                status: true,
                message: 'Insert packing list file Successfully',
                data: res,
            };
        } catch (error) {
            throw new Error('Insert packing list file Error: ' + error.message);
        }
    }
}
