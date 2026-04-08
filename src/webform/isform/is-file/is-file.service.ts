import { Injectable } from '@nestjs/common';
import { CreateIsFileDto } from './dto/create-is-file.dto';
import { SearchIsFileDto } from './dto/search-is-file.dto';
import { IsFileRepository } from './is-file.repository';

@Injectable()
export class IsFileService {
    constructor(private readonly repo: IsFileRepository) {}

    async getFile(dto: SearchIsFileDto) {
        return this.repo.getFile(dto);
    }

    async setId(dto: SearchIsFileDto) {
        const lastID = await this.repo.getNextSeq(dto);
        if (lastID.length > 0) {
            return lastID[0].FILE_ID + 1;
        } else {
            return 1;
        }
    }

    async insert(dto: CreateIsFileDto) {
        try {
            const id = await this.setId(dto);
            const data = {
                ...dto,
                FILE_ID: id,
            };

            const res = await this.repo.insert(data);
            if (!res.identifiers || res.identifiers.length === 0) {
                throw new Error('Failed to insert IS File');
            }
            return {
                status: true,
                message: 'Insert IS File Successfully',
            };
        } catch (error) {
            throw new Error('Insert IS File Error: ' + error.message);
        }
    }
}
