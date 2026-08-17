import { Injectable } from '@nestjs/common';
import { CountryOriginRepository } from '../country_origin.repository';
import { CreateCountryOriginDto } from '../dto/create_country_origin.dto';

@Injectable()
export class CountryOriginService {
    constructor(protected readonly repo: CountryOriginRepository) {}

    async create(dto: CreateCountryOriginDto){
        try {
            const res = await this.repo.save(dto);
            if(!res){
                return {
                    status: false,
                    message: 'Save Country Origin Error',
                }
            }
            return {
                status: true,
                message: 'Save Country Origin Success',
                data: res,
            }
        } catch (error) {
            throw new Error(`Save Country Origin Error: ${error.message}`);
        }
    }
}
