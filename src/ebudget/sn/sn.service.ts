import { Injectable } from '@nestjs/common';
import { SearchEbudgetSnDto } from './dto/search-sn.dto';
import { SnRepository } from './sn.repository';

@Injectable()
export class SnService {
    constructor(private readonly repo: SnRepository) {}

    findAll() {
        return this.repo.findAll();
    }

    async getDataSn(dto: SearchEbudgetSnDto) {
        return await this.repo.getDataSn(dto);
    }
}
