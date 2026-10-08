import { Injectable } from '@nestjs/common';

import { FiltersDto } from 'src/common/dto/filter.dto';
import { RncauseRepository } from './rncause.repository';

@Injectable()
export class RncauseService {
    constructor(private readonly repo: RncauseRepository) {}

    async findAll() {
        try {
            const res = await this.repo.findAll();
            const length = res.length;

            if (length === 0) {
                return {
                    status: false,
                    message: 'Search RNCAUSE Failed: No data found',
                    data: [],
                };
            }

            return {
                status: true,
                message: `Search RNCAUSE data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Search RNCAUSE Error: ' + error.message);
        }
    }

    async findOne(cid: number) {
        try {
            const res = await this.repo.findOne(cid);

            if (!res) {
                return {
                    status: false,
                    message: `Search RNCAUSE by CID ${cid} Failed: No data found`,
                };
            }

            return {
                status: true,
                message: `Search RNCAUSE by CID ${cid} data found 1 record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error(`Search RNCAUSE by CID ${cid} Error: ${error.message}`);
        }
    }

    async search(dto: FiltersDto) {
        try {
            const res = await this.repo.search(dto);
            const length = res.length;

            if (length === 0) {
                return {
                    status: false,
                    message: 'Search RNCAUSE Failed: No data found',
                    data: [],
                };
            }

            return {
                status: true,
                message: `Search RNCAUSE data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Search RNCAUSE Error: ' + error.message);
        }
    }
}