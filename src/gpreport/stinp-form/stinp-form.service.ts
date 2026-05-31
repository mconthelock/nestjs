import { Injectable } from '@nestjs/common';
import { CreateStinpFormDto } from './dto/create-stinp-form.dto';
import { UpdateStinpFormDto } from './dto/update-stinp-form.dto';
import { StinpFormRepository } from './stinp-form.repository';
import { FormDto } from 'src/webform/center/form/dto/form.dto';

@Injectable()
export class StinpFormService {
    constructor(private readonly repo: StinpFormRepository) {}

    async create(dto: CreateStinpFormDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                return { status: false, message: 'Failed to create StinpForm' };
            }
            return {
                status: true,
                message: 'StinpForm created successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(`Failed to create StinpForm: ${error.message}`);
        }
    }

    async update(condition: FormDto, data: UpdateStinpFormDto) {
        try {
            const res = await this.repo.update(condition, data);
            if (res.affected === 0) {
                return { status: false, message: 'Failed to update StinpForm' };
            }
            return {
                status: true,
                message: 'StinpForm updated successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(`Failed to update StinpForm: ${error.message}`);
        }
    }

    async findOne(condition: FormDto) {
        try {
            const res = await this.repo.findOne(condition);
            if (!res) {
                return {
                    status: false,
                    message: 'Safety inspection report  not found',
                };
            }
            return {
                status: true,
                message: 'Safety inspection report  found successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Failed to find Safety inspection report : ${error.message}`,
            );
        }
    }
}
