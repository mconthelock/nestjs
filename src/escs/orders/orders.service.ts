import { Injectable } from '@nestjs/common';
import { SearchOrderDto } from './dto/search-orders.dto';
import { logQuery } from 'src/common/utils/debug.utils';
import { OrdersRepository } from './orders.repository';
import { ORDERS } from 'src/common/Entities/escs/table/ORDERS.entity';

@Injectable()
export class OrdersService {
    constructor(private readonly repo: OrdersRepository) {}

    async checkOrderPartSupply(dto: SearchOrderDto): Promise<{
        status: boolean;
        data?: ORDERS[];
    }> {
        const data = await this.repo.checkOrderPartSupply(dto);
        if (data.length > 0) {
            return {
                status: true,
                data: data.filter((item) => {
                    const checked = item.ORD_ITEM.match(/([S])$/);
                    if (checked) return item;
                }),
            };
        } else {
            return { status: false };
        }
    }
}
