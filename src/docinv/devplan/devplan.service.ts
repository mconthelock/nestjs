import { Injectable } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { DevplanRepository } from './devplan.repository';

@Injectable()
export class DevplanService {
    constructor(protected readonly repo: DevplanRepository) {}

    async search(dto: FiltersDto) {
        try {
            return await this.repo.search(dto);
        } catch (error) {
            throw new Error(error);
        }
    }
}
