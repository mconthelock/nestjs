import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../../amec/users/users.service';
import { AnnualUniformRepository } from './annual.repository';

import { CreateUniformDto } from './dto/create-uniform.dto';
import { UpdateUniformDto } from './dto/update-uniform.dto';
import { CreateAnnualDto } from './dto/create-annual.dto';

import { UNIFORM } from '../../common/Entities/gpreport/table/UNIFORM.entity';
import { UNIFORM_RIGHT } from '../../common/Entities/gpreport/table/UNIFORM_RIGHT.entity';
import { AnnualUniform } from 'src/common/Entities/gpreport/table/UNIFORM_ANNUAL.entity';
import { AnnualUniformDetail } from 'src/common/Entities/gpreport/table/UNIFORM_ANNUAL_DETAIL.entity';

@Injectable()
export class UniformService {
    constructor(
        @InjectRepository(UNIFORM, 'gpreportConnection')
        private readonly uniform: Repository<UNIFORM>,

        @InjectRepository(UNIFORM_RIGHT, 'gpreportConnection')
        private readonly right: Repository<UNIFORM_RIGHT>,

        private UsersService: UsersService,
        protected readonly repo: AnnualUniformRepository,
    ) {}

    findAll() {
        return this.uniform.find({
            relations: ['category'],
        });
    }

    async findRights() {
        const rights = await this.right.find();
        const users = await this.UsersService.search();
        const userFiltered = users.filter(
            (u) => u.CSTATUS === '1' && parseInt(u.SPOSCODE) < 80,
        );
        const data = userFiltered.map((user) => {
            const userRights = rights.filter(
                (right) => right.EMPCOD === user.SEMPNO,
            );
            return {
                ...user,
                rights: userRights,
            };
        });
        return data;
    }

    //Annual Request
    async findAnnualRequest(userId: string, year: number) {
        return this.repo.search(userId, year);
    }

    async createAnnualRequest(data: CreateAnnualDto) {
        const { DETAILS, ...header } = data ?? {};

        if (!Array.isArray(DETAILS)) {
            throw new BadRequestException('DETAILS must be an array');
        }

        const detail: Partial<AnnualUniformDetail>[] = DETAILS;
        return this.repo.create(header as Partial<AnnualUniform>, detail);
    }
}
