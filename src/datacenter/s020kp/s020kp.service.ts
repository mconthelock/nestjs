import { Injectable } from '@nestjs/common';
import { S020kpRepository } from './s020kp.repository';

@Injectable()
export class S020kpService {
    constructor(private readonly repo: S020kpRepository) {}

    async find(order: string) {
        try {
            const res = await this.repo.find(order);
            if (res.length === 0) {
                return {
                    status: false,
                    message: `No records found for order ${order}`,
                };
            }
            return {
                status: true,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Failed to find S020KP with order ${order}: ${error.message}`,
            );
        }
    }
}
