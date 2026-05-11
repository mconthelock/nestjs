import { Injectable } from '@nestjs/common';
import {
    CreateStinpFormListDto,
    PrimaryKeyStinpFormListDto,
} from './dto/create-stinp-form-list.dto';
import { UpdateStinpFormListDto } from './dto/update-stinp-form-list.dto';
import { StinpFormListRepository } from './stinp-form-list.repository';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Injectable()
export class StinpFormListService {
    constructor(private readonly repo: StinpFormListRepository) {}

    async findOne(condition: PrimaryKeyStinpFormListDto) {
        try {
            const res = await this.repo.findOne(condition);
            if (!res) {
                return {
                    status: false,
                    message: 'Safety inspection report list not found',
                };
            }
            return {
                status: true,
                message: 'Safety inspection report list found successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Failed to find Safety inspection report list: ${error.message}`,
            );
        }
    }

    async find(form: FormDto) {
        try {
            const res = await this.repo.find(form);
            if (res.length === 0) {
                return {
                    status: false,
                    message: 'Safety inspection report list not found',
                };
            }
            return {
                status: true,
                message: `Safety inspection report list found (${res.length} records)`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Failed to find Safety inspection report list: ${error.message}`,
            );
        }
    }

    async create(dto: CreateStinpFormListDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                return {
                    status: false,
                    message: 'Failed to create Safety inspection report list',
                };
            }
            return {
                status: true,
                message: 'Safety inspection report list created successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Failed to create Safety inspection report list: ${error.message}`,
            );
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
                    message: 'Failed to update Safety inspection report list',
                };
            }
            return {
                status: true,
                message: 'Safety inspection report list updated successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Failed to update Safety inspection report list: ${error.message}`,
            );
        }
    }

    async delete(condition: PrimaryKeyStinpFormListDto) {
        try {
            const res = await this.repo.delete(condition);
            if (res.affected === 0) {
                return {
                    status: false,
                    message: 'Failed to delete Safety inspection report list',
                };
            }
            return {
                status: true,
                message: 'Safety inspection report list deleted successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Failed to delete Safety inspection report list: ${error.message}`,
            );
        }
    }
}
