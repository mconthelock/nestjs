import { Injectable } from '@nestjs/common';
import { SearchRepDto } from './dto/search-rep.dto';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { RepRepository } from './rep.repository';

@Injectable()
export class RepService {
    constructor(private readonly repo: RepRepository) {}

    getRep(dto: SearchRepDto) {
        return this.repo.getRep(dto);
    }

    async getRepresent(dto: SearchRepDto) {
        const data = await this.getRep(dto);

        let represent = dto.VEMPNO;
        if (Array.isArray(data) && data.length > 0 && data[0]?.VREPNO) {
            represent = data[0].VREPNO;
        }
        return represent;
    }
}
