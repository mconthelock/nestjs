import { Injectable } from '@nestjs/common';
import { CountryOriginBulkListViewRepository } from './country_origin_bulk_list_view.repository';

@Injectable()
export class CountryOriginBulkListViewService {
    constructor(private readonly repo: CountryOriginBulkListViewRepository) {}

    async findAll() {
        try{
            const res = await this.repo.findAll();
            if(res.length > 0){
                return {
                    status: true,
                    message: `Data found ${res.length} records`,
                    data: res
                }
            }
            return {
                status: false,
                message: 'No data found',
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }
}
