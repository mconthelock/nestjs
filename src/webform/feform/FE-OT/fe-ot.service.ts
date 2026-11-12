import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatefeotDetails } from './dto/create-fe-ot.dto';
import { FEOTRepository } from './fe-ot.repository';
import { UpdatefeotDto } from './dto/update-fe-ot.dto';

@Injectable()
export class FEOTService {
    constructor(private readonly repo: FEOTRepository) {}

    async create(dto: CreatefeotDetails, ip: string) {
        try {
            const result = await this.repo.createDetails(dto);

            return {
                status: true,
                message: 'Create FE OT successfully',
                data: result,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: false,
                message: 'Create FE OT failed',
                error: error.message,
            });
        }
    }

    async getDataOT(dto: {
        PLANYEAR: number;
        PLANMONTH: number;
        SEMPNO: string;
    }) {
        return this.repo.getDataOT(dto);
    }

    async remove(dto: {
        PLANYEAR: number;
        PLANMONTH: number;
        SEMPNO: string;
        WORKDATE: string;
    }) {
        const result = await this.repo.remove(dto);

        if (!result.affected) {
            return {
                status: false,
                message: 'OT data not found',
            };
        }
        return {
            status: true,
            message: 'Delete OT data successfully',
            data: result,
        };
    }

    async update(dto: UpdatefeotDto, ip: string) {
        try {
            const result = await this.repo.update(dto);

            if (!result.affected) {
                return {
                    status: false,
                    message: 'OT data not found',
                };
            }

            return {
                status: true,
                message: 'Update FE OT successfully',
                data: result,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: false,
                message: 'Update FE OT failed',
                error: error.message,
            });
        }
    }
}
