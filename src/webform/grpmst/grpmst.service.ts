import { Injectable } from '@nestjs/common';
import { GrpmstRepository } from './grpmst.repository';

@Injectable()
export class GrpmstService {
    constructor(private readonly repo: GrpmstRepository) {}

    async findAll() {
        try {
            const res = await this.repo.findAll();
            if (!res || res.length === 0) {
                return {
                    status: false,
                    message: 'No records found',
                };
            }
            return {
                status: true,
                message: `Records ${res.length} found`,
                data: res,
            };
        } catch (error) {
            throw new Error(`Failed to retrieve records: ${error.message}`);
        }
    }
}
