import { Injectable } from '@nestjs/common';
import {
    CreateStinpFormListDto,
    PrimaryKeyStinpFormListDto,
} from './dto/create-stinp-form-list.dto';
import { UpdateStinpFormListDto } from './dto/update-stinp-form-list.dto';
import { StinpFormListRepository } from './stinp-form-list.repository';

@Injectable()
export class StinpFormListService {
    constructor(private readonly repo: StinpFormListRepository) {}

    async create(dto: CreateStinpFormListDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                return {
                    status: false,
                    message: 'Failed to create StinpFormList',
                };
            }
            return {
                status: true,
                message: 'StinpFormList created successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(`Failed to create StinpFormList: ${error.message}`);
        }
    }

    async update(
        condition: PrimaryKeyStinpFormListDto,
        data: UpdateStinpFormListDto,
    ) {
        try {
            const res = await this.repo.update(condition, data);
            if (res.affected === 0) {
                return {
                    status: false,
                    message: 'Failed to update StinpFormList',
                };
            }
            return {
                status: true,
                message: 'StinpFormList updated successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(`Failed to update StinpFormList: ${error.message}`);
        }
    }
}
