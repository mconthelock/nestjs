import { Injectable } from '@nestjs/common';
import { DpmsCountryConditionRepository } from './dpms_country_condition.repository';
import { DeleteCountryConditionDto, CreateCountryConditionDto } from './dto/dpms_country_condition.dto';

@Injectable()
export class DpmsCountryConditionService {
    constructor(private readonly repo: DpmsCountryConditionRepository) {}

    async find(data: DeleteCountryConditionDto) {
        try {
            const res = await this.repo.find(data);
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: 'No records found',
                };
            }
            return {
                status: true,
                message: `Data found ${length} records`,
                data: res,
            };
        } catch (error) {
            throw error;
        }
    }

    async findByType(type: number) {
        try {
            const res = await this.repo.findByType(type);
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: 'No records found',
                };
            }
            return {
                status: true,
                message: `Data found ${length} records`,
                data: res,
            };
        } catch (error) {
            throw error;
        }
    }

    async create(data: CreateCountryConditionDto){
        try {
            const res = await this.repo.save(data);
            if(!res){
                return {
                    status: false,
                    message: 'Failed to add Country'
                }
            }
            return {
                status: true,
                message: 'Add country successfully',
                data: res,
            };
        } catch (error) {
            throw error;
        }
    }

    async delete(data: DeleteCountryConditionDto) {
        try {
            const res = await this.repo.delete(data.COUNTRY, data.TYPE);
            if(!res){
                return {
                    status: false,
                    message: 'Failed to delete Country'
                }
            }
            return {
                status: true,
                message: 'Deleted country successfully',
                data: res,
            };
        } catch (error) {
            throw error;
        }
    }
}
