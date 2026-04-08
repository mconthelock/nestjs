import { Injectable } from '@nestjs/common';
import { InsertIsCfDto } from './dto/create-is-cf.dto';
import { UpdateIsCfDto } from './dto/update-is-cf.dto';
import { IsCfsRepository } from './is-cfs.repository';

@Injectable()
export class IsCfsService {
    constructor(protected readonly repo: IsCfsRepository) {}

    async create(dto: InsertIsCfDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                throw new Error('Failed to create Confirm sheet');
            }
            return {
                status: true,
                message: 'Confirm sheet created successfully',
                data: res,
            };
        } catch (error) {
            throw new Error('Create Confirm sheet Error: ' + error.message);
        }
    }
}
