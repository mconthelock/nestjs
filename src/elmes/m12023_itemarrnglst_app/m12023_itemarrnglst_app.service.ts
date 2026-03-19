import { Injectable } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { M12023ItemarrnglstAppRepository } from './m12023_itemarrnglst_app.repository';

@Injectable()
export class M12023ItemarrnglstAppService {
    constructor(private readonly repo: M12023ItemarrnglstAppRepository) {}
    async findAll() {
        try {
            const res = await this.repo.findAll();
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message:
                        'Search M12023ItemarrnglstApp Failed: No data found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Search M12023ItemarrnglstApp data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                'Search M12023ItemarrnglstApp Error: ' + error.message,
            );
        }
    }

    async findOne(order: string) {
        try {
            const res = await this.repo.findOne(order);
            if (res == null) {
                return {
                    status: false,
                    message: `Search M12023ItemarrnglstApp by id ${order} Failed: No data found`,
                };
            }
            return {
                status: true,
                message: `Search M12023ItemarrnglstApp by id ${order} data found 1 record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Search M12023ItemarrnglstApp by id ${order} Error: ` +
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
                    message:
                        'Search M12023ItemarrnglstApp Failed: No data found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Search M12023ItemarrnglstApp data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                'Search M12023ItemarrnglstApp Error: ' + error.message,
            );
        }
    }
}
