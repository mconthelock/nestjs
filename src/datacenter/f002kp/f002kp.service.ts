import { Injectable } from '@nestjs/common';
import { CreateF002kpDto } from './dto/create-f002kp.dto';
import { UpdateF002kpDto } from './dto/update-f002kp.dto';
import { F002kpRepository } from './f002kp.repository';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Injectable()
export class F002kpService {
    constructor(private readonly repo: F002kpRepository) {}
    async findAll() {
        try {
            const res = await this.repo.findAll();
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: 'Search F002KP Failed: No data found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Search F002KP data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Search F002KP Error: ' + error.message);
        }
    }

    async findOne(controlNo: string) {
        try {
            const res = await this.repo.findOne(controlNo);
            if (res == null) {
                return {
                    status: false,
                    message: `Search F002KP by control number ${controlNo} Failed: No data found`,
                };
            }
            return {
                status: true,
                message: `Search F002KP by control number ${controlNo} data found 1 record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Search F002KP by control number ${controlNo} Error: ` +
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
                    message: 'Search F002KP Failed: No data found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Search F002KP data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Search F002KP Error: ' + error.message);
        }
    }
}
