import { Injectable } from '@nestjs/common';
import { S049kpRepository } from './s049kp.repository';

@Injectable()
export class S049kpService {
    constructor(private readonly repo: S049kpRepository) {}

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
                `Failed to find S049KP with order ${order}: ${error.message}`,
            );
        }
    }
}
