import { Injectable } from '@nestjs/common';
import { CountryOriginNotSetViewRepository } from './country_origin_not_set_view.repository';

@Injectable()
export class CountryOriginNotSetViewService {
    constructor(private readonly repo: CountryOriginNotSetViewRepository) {}

    async findAll() {
        try {
            const res = await this.repo.findAll();
            if (!res || res.length === 0) {
                return {
                    status: false,
                    message: 'No records found',
                };
            }
            return {
                status: true,
                message: 'Records found ' + res.length + ' record(s)',
                data: res,
            };
        } catch (error) {
            throw error;
        }
    }
}
