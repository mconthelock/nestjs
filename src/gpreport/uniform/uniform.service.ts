import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUniformDto } from './dto/create-uniform.dto';
import { UpdateUniformDto } from './dto/update-uniform.dto';

import { UNIFORM } from '../../common/Entities/gpreport/table/UNIFORM.entity';
import { UNIFORM_RIGHT } from '../../common/Entities/gpreport/table/UNIFORM_RIGHT.entity';
import { UsersService } from '../../amec/users/users.service';

@Injectable()
export class UniformService {
    constructor(
        @InjectRepository(UNIFORM, 'gpreportConnection')
        private readonly uniform: Repository<UNIFORM>,

        @InjectRepository(UNIFORM_RIGHT, 'gpreportConnection')
        private readonly right: Repository<UNIFORM_RIGHT>,

        private UsersService: UsersService,
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
}
