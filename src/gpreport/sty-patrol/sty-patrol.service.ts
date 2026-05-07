import { Injectable } from '@nestjs/common';
import { CreateStyPatrolDto } from './dto/create-sty-patrol.dto';
import { UpdateStyPatrolDto } from './dto/update-sty-patrol.dto';
import { StyPatrolRepository } from './sty-patrol.repository';

@Injectable()
export class StyPatrolService {
    constructor(private readonly repo: StyPatrolRepository) {}

    async create(
        createStyPatrolDto: CreateStyPatrolDto | CreateStyPatrolDto[],
    ) {
        try {
            const res = await this.repo.create(createStyPatrolDto);
            if (!res) {
                return { status: false, message: 'Failed to create StyPatrol' };
            }
            return {
                status: true,
                message: 'StyPatrol created successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(`Failed to create StyPatrol: ${error.message}`);
        }
    }

    async update(dto: UpdateStyPatrolDto) {
        try {
            const res = await this.repo.update(dto);
            if (res.affected === 0) {
                return { status: false, message: 'Failed to update StyPatrol' };
            }
            return {
                status: true,
                message: 'StyPatrol updated successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(`Failed to update StyPatrol: ${error.message}`);
        }
    }
}
