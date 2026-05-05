import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { GetOrderRepository } from './get-order.repository';
import { GetOrderDto } from './dto/get-order.dto';
import { GetOrderResponseDto } from './dto/get-order-response.dto';

@Injectable()
export class GetOrderService {
    constructor(
        private readonly repo: GetOrderRepository
    ) {}

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

    async getOrder(dto: GetOrderDto): Promise<GetOrderResponseDto | null> {
        try {
            const res = await this.repo.findOrder(dto);
            if (!res?.length) {
                throw new NotFoundException('Order not found');
            }

            const { ORDERNO, TYPE_MODEL } = res[0];
            return {
                orderNo: ORDERNO,
                typeModel: TYPE_MODEL
            };
        } catch (err) {
            if (err instanceof NotFoundException) throw err;

            throw new InternalServerErrorException({
                message: 'GET_ORDER failed',
                error: err?.message
            });
        }
    }
}
