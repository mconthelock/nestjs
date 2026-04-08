import { Inject, Injectable } from '@nestjs/common';
import { CreatePprbiddingDto } from './dto/create-pprbidding.dto';
import { UpdatePprbiddingDto } from './dto/update-pprbidding.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { PPRBIDDING } from 'src/common/Entities/amec/table/PPRBIDDING.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { PprbiddingRepository } from './pprbidding.repository';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Injectable()
export class PprbiddingService {
    constructor(
        @InjectRepository(PPRBIDDING, 'webformConnection')
        private repo: Repository<PPRBIDDING>,
        @InjectDataSource('webformConnection')
        private dataSource: DataSource,
        private readonly pprrepo: PprbiddingRepository,
    ) {}

    async create(dto: CreatePprbiddingDto) {
        try {
            const res = await this.repo.save(dto);
            return {
                status: true,
                message: 'Insert PPRBIDDING Successfully',
                data: res,
            };
        } catch (error) {
            throw new Error('Insert PPRBIDDING Error: ' + error.message);
        }
    }

    async findAll() {
        try {
            const res = await this.pprrepo.findAll();
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: 'Search PR Bidding Failed: No data found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Search PR Bidding data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Search PR Bidding Error: ' + error.message);
        }
    }

    async search(dto: FiltersDto) {
        try {
            const res = await this.pprrepo.search(dto);
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: 'Search PR Bidding Failed: No data found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Search PR Bidding data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Search PR Bidding Error: ' + error.message);
        }
    }
}
