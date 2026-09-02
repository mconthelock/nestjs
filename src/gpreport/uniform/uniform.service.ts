import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../../amec/users/users.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { AnnualUniformRepository } from './annual.repository';

import { CreateAnnualDto } from './dto/create-annual.dto';
import { CreateUNAFormDto } from './dto/create-una-form.dto';

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

        protected readonly repo: AnnualUniformRepository,
        private UsersService: UsersService,
        private readonly frmmst: FormmstService,
        private readonly frmcrt: FormCreateService,
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

    async createAnnualRequest(data: CreateAnnualDto, ip: string) {
        const { DETAILS, ...header } = data ?? {};

        if (!Array.isArray(DETAILS)) {
            throw new BadRequestException('DETAILS must be an array');
        }

        const detail: Partial<AnnualUniformDetail>[] = DETAILS;
        const result = await this.repo.create(
            header as Partial<AnnualUniform>,
            detail,
        );
        return { status: 'success', result };
    }

    async deleteRequest(userId: string, year: number) {
        const existingRequests = await this.repo.search(userId, year);
        if (!existingRequests.length) {
            throw new BadRequestException('No requests found to delete');
        }
        return this.repo.delete(userId, year);
    }
}
