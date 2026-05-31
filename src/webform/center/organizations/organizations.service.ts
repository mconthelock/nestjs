import { Injectable } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { OrganizationsRepository } from './organizations.repository';

@Injectable()
export class OrganizationsService {
    constructor(private readonly repo: OrganizationsRepository) {}
    async findAll() {
        try {
            const res = await this.repo.findAll();
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: 'Search ORGANIZATIONS Failed: No data found',
                    data: [],
                };
            }
            for (const d of res){
                
            }
            return {
                status: true,
                message: `Search ORGANIZATIONS data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Search ORGANIZATIONS Error: ' + error.message);
        }
    }

    async search(dto: FiltersDto) {
        try {
            const res = await this.repo.search(dto);
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: 'Search ORGANIZATIONS Failed: No data found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Search ORGANIZATIONS data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Search ORGANIZATIONS Error: ' + error.message);
        }
    }
}
