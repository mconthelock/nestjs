import { Injectable } from '@nestjs/common';
import { CreateGetOrderDto } from './dto/create-get-order.dto';
import { UpdateGetOrderDto } from './dto/update-get-order.dto';
import { GetOrderDto } from './dto/get-order.dto';
import { GetOrderRepository } from './get-order.repository';

@Injectable()
export class GetOrderService {
    constructor(private readonly repo: GetOrderRepository) {}

    async findOne(prod: string, ordNo: string, item: string, id: number) {
        try {
            const res = await this.repo.findOne(prod, ordNo, item, id);
            if (!res) {
                return {
                    status: false,
                    message: 'Data not found',
                };
            }
            return {
                status: true,
                data: res,
                message: 'Data found',
            };
        } catch (error) {
            throw new Error(`Failed to get order: ${error.message}`);
        }
    }

    async getOrder(dto: GetOrderDto) {
        try {
            return await this.repo.findOrder(dto);
        } catch (error) {
            throw new Error(`GET_ORDER failed: ${error.message}`);
        }
    }
}
