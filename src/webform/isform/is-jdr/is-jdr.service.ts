import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISJDR_RESULT } from 'src/common/Entities/webform/table/ISJDR_RESULT.entity';
import { CreateIsJdrDto } from './dto/create-is-jdr.dto';
import { UpdateIsJdrDto } from './dto/update-is-jdr.dto';
import { SearchIsJdrDto } from './dto/search-is-jdr.dto';

@Injectable()
export class IsJdrService {
    constructor(
        @InjectRepository(ISJDR_RESULT, 'webformConnection')
        private readonly jdr: Repository<ISJDR_RESULT>,
    ) {}

    async create(createIsJdrDto: CreateIsJdrDto) {
        return await this.jdr.save(createIsJdrDto);
    }

    async update(dto: UpdateIsJdrDto) {
        const data = await this.jdr.findOne({
            where: {
                RC_SECTION: dto.RC_SECTION,
                RC_DATETIME: dto.RC_DATETIME,
                RC_JOBNO: dto.RC_JOBNO,
            },
        });
        if (data) {
            return await this.jdr.update(
                {
                    RC_SECTION: dto.RC_SECTION,
                    RC_DATETIME: dto.RC_DATETIME,
                    RC_JOBNO: dto.RC_JOBNO,
                },
                dto,
            );
        } else {
            return await this.jdr.save(dto);
        }
    }

    async search(data: SearchIsJdrDto) {
        const { query, server, startDate, endDate, status } = data;
        const queryBuilder = this.jdr.createQueryBuilder('jobs');
        if (server) {
            queryBuilder.andWhere('jobs.RC_SECTION = :RC_SECTION', {
                RC_SECTION: data.server,
            });
        }

        if (startDate) {
            queryBuilder.andWhere('jobs.RC_DATETIME >= :startDate', {
                startDate,
            });
        }

        if (endDate) {
            queryBuilder.andWhere('jobs.RC_DATETIME <= :endDate', {
                endDate,
            });
        }

        const results = await queryBuilder.getRawMany();
        return results;
    }
}
