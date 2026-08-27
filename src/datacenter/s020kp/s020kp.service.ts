import { Injectable } from '@nestjs/common';
import { S020kpRepository } from './s020kp.repository';

@Injectable()
export class S020kpService {
    constructor(private readonly repo: S020kpRepository) {}

    async find(order: string, type?: 'from-order' | 'to-order' | 'all') {
        try {
            let res = null;
            switch (type) {
                case 'from-order':
                    res = await this.repo.findFromOrder(order);
                    break;
                case 'to-order':
                    res = await this.repo.findToOrder(order);
                    break;
                case 'all':
                default:
                    res = await this.repo.findAll(order);
            }
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
