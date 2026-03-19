import { Injectable } from '@nestjs/common';
import { CreateF001kpDto } from './dto/create-f001kp.dto';
import { UpdateF001kpDto } from './dto/update-f001kp.dto';
import { F001kpRepository } from './f001kp.repository';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Injectable()
export class F001kpService {
    constructor(private readonly repo: F001kpRepository) {}
    async findAll() {
        try {
            const res = await this.repo.findAll();
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: 'Search F001KP Failed: No data found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Search F001KP data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Search F001KP Error: ' + error.message);
        }
    }

    async findOne(controlNo: string) {
        try {
            const res = await this.repo.findOne(controlNo);
            if (res == null) {
                return {
                    status: false,
                    message: `Search F001KP by control number ${controlNo} Failed: No data found`,
                };
            }
            return {
                status: true,
                message: `Search F001KP by control number ${controlNo} data found 1 record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Search F001KP by control number ${controlNo} Error: ` +
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
                    message: 'Search F001KP Failed: No data found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Search F001KP data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Search F001KP Error: ' + error.message);
        }
    }
}
