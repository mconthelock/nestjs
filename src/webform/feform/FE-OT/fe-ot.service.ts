import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatefeotDetails } from './dto/create-fe-ot.dto';
import { FEOTRepository } from './fe-ot.repository';

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

    async getDataOT() {
        return this.repo.getDataOT();
    }
}
