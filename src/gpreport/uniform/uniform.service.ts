import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../../amec/users/users.service';
import { AnnualUniformRepository } from './annual.repository';

import { CreateAnnualDto } from './dto/create-annual.dto';
import { CreateUNAFormDto } from './dto/create-una-form.dto';

import { UNIFORM } from 'src/common/Entities/gpreport/table/UNIFORM.entity';
import { UNIFORM_RIGHT } from 'src/common/Entities/gpreport/table/UNIFORM_RIGHT.entity';
import { UniformCalendar } from 'src/common/Entities/gpreport/table/UNIFORM_CALENDAR.entity';
import { AnnualUniform } from 'src/common/Entities/gpreport/table/UNIFORM_ANNUAL.entity';
import { AnnualUniformDetail } from 'src/common/Entities/gpreport/table/UNIFORM_ANNUAL_DETAIL.entity';
import { CreateCalendarDto } from './dto/create-calendar.dto';

@Injectable()
export class UniformService {
    constructor(
        @InjectRepository(UNIFORM, 'gpreportConnection')
        private readonly uniform: Repository<UNIFORM>,
        @InjectRepository(UniformCalendar, 'gpreportConnection')
        private readonly calendar: Repository<UniformCalendar>,
        @InjectRepository(UNIFORM_RIGHT, 'gpreportConnection')
        private readonly right: Repository<UNIFORM_RIGHT>,

        protected readonly repo: AnnualUniformRepository,
        private UsersService: UsersService,
    ) {}

    findAll() {
        return this.uniform.find({
            relations: ['category'],
        });
    }

    async findCalendar() {
        return this.calendar.find();
    }

    async upsertCalendar(data: CreateCalendarDto) {
        const existing = await this.calendar.find({
            where: { FYEAR: data.FYEAR },
        });
        if (existing.length) {
            await this.calendar.update(
                { FYEAR: data.FYEAR },
                {
                    SDATE: data.SDATE,
                    EDATE: data.EDATE,
                    UPDATE_AT: data.UPDATE_AT,
                    UPDATE_BY: data.UPDATE_BY,
                },
            );
        } else {
            await this.calendar.insert({
                FYEAR: data.FYEAR,
                SDATE: data.SDATE,
                EDATE: data.EDATE,
                CREATE_AT: data.UPDATE_AT,
                CREATE_BY: data.UPDATE_BY,
            });
        }
        return this.calendar.find({ where: { FYEAR: data.FYEAR } });
    }

    async deleteCalendar(year: number) {
        const existing = await this.calendar.find({
            where: { FYEAR: year },
        });
        if (!existing.length) {
            throw new BadRequestException('No calendar found to delete');
        }
        return this.calendar.delete({ FYEAR: year });
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
    async findAnnualRequestYear(year: number) {
        const users = await this.UsersService.search();
        const userFiltered = users.filter(
            (u) => u.CSTATUS === '1' && parseInt(u.SPOSCODE) < 80,
        );
        const request = await this.repo.findYear(year);
        const data = userFiltered.map((user) => {
            const userRreq = request.filter(
                (req) => req.REQ_USER === user.SEMPNO,
            );
            return {
                ...user,
                result: userRreq,
            };
        });
        return data;
    }

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

    async deleteRequestDetail(userId: string, year: number) {
        const existingRequests = await this.repo.search(userId, year);
        if (!existingRequests.length) {
            throw new BadRequestException('No requests found to delete');
        }
        return this.repo.deleteDetail(userId, year);
    }
}
