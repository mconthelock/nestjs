import { Injectable } from '@nestjs/common';
import { K850mpRepository } from './k850mp.repository';

@Injectable()
export class K850mpService {
    constructor(private readonly repo: K850mpRepository) {}

    async findAll() {
        try {
            const res = await this.repo.findAll();
            if (res.length > 0) {
                return {
                    status: true,
                    message: `Data found ${res.length} records`,
                    data: res,
                };
            }
            return {
                status: false,
                message: 'No data found',
            };
        } catch (error) {
            throw error;
        }
    }
}
