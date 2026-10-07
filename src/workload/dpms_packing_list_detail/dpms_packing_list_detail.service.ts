import { Injectable } from '@nestjs/common';
import { DpmsPackingListDetailRepository } from './dpms_packing_list_detail.repository';

@Injectable()
export class DpmsPackingListDetailService {
    constructor(private readonly repo: DpmsPackingListDetailRepository) {}

    async getOrderOrigin(order: string) {
        try {
            const res = await this.repo.getOrderOrigin(order);
            if (!res) {
                return {
                    status: false,
                    message: 'No order origin found',
                };
            }
            return {
                status: true,
                message: `Order origin found`,
                data: res,
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
