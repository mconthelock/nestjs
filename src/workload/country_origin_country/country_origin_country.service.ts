import { Injectable } from '@nestjs/common';
import { CountryOriginCountryRepository } from './country_origin_country.repository';
import { CreateCountryOriginCountryDto } from './dto/create_country_origin_country.dto';

@Injectable()
export class CountryOriginCountryService {
    constructor(protected readonly repo: CountryOriginCountryRepository) {}

    async getCountry() {
        try {
            const res = await this.repo.getCountry();
            if (res.length > 0) {
                return {
                    status: true,
                    message: `Data found ${res.length} records`,
                    data: res,
                };
            }
            return {
                status: false,
                message: 'No data found',
            };
        } catch (error) {
            throw new Error(`Get Country Origin Error: ${error.message}`);
        }
    }

    async create(dto: CreateCountryOriginCountryDto | CreateCountryOriginCountryDto[]) {
        try {
            const res = await this.repo.save(dto);
            if (!res) {
                return {
                    status: false,
                    message: 'Save Country Origin Error',
                };
            }
            return {
                status: true,
                message: 'Save Country Origin Success',
                data: res,
            };
        } catch (error) {
            throw new Error(`Save Country Origin Error: ${error.message}`);
        }
    }
}
