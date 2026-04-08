import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { SearchSequenceOrgDto } from './dto/search-sequence-org.dto';
import { SequenceOrgRepository } from './sequence-org.repository';
import { SEQUENCEORG } from 'src/common/Entities/webform/table/SEQUENCEORG.entity';

@Injectable()
export class SequenceOrgService {
    constructor(private readonly repo: SequenceOrgRepository) {}

    findAll() {
        return this.repo.findAll();
    }

    async getManager(empno: string, selectFields?: string[]) {
        return await this.repo.getManager(empno, selectFields);
    }

    async getSubordinates(empno: string) {
        return await this.repo.getSubordinates(empno);
    }

    async search(dto: SearchSequenceOrgDto): Promise<SEQUENCEORG[]> {
        return await this.repo.search(dto);
    }
}
