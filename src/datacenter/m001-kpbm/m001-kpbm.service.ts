import { Injectable } from '@nestjs/common';
import { M001KpbmRepository } from './m001-kpbm.repository';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Injectable()
export class M001KpbmService {
    constructor(private readonly repo: M001KpbmRepository) {}
    async findAll() {
        try {
            const res = await this.repo.findAll();
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: 'Search M001KPBM Failed: No data found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Search M001KPBM data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Search M001KPBM Error: ' + error.message);
        }
    }

    async findOne(order: string, item: string, prod: string) {
        try {
            const res = await this.repo.findOne(order, item, prod);
            if (res == null) {
                return {
                    status: false,
                    message: `Search M001KPBM by ${order}, ${item}, ${prod} Failed: No data found`,
                };
            }
            return {
                status: true,
                message: `Search M001KPBM by ${order}, ${item}, ${prod} data found 1 record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Search M001KPBM by ${order}, ${item}, ${prod} Error: ` +
                    error.message,
            );
        }
    }

    async search(dto: FiltersDto) {
        try {
            const res = await this.repo.search(dto);
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: 'Search M001KPBM Failed: No data found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Search M001KPBM data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Search M001KPBM Error: ' + error.message);
        }
    }
}
