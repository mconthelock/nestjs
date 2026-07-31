import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUniformDto } from './dto/create-uniform.dto';
import { UpdateUniformDto } from './dto/update-uniform.dto';

import { UNIFORM } from '../../common/Entities/gpreport/table/UNIFORM.entity';

@Injectable()
export class UniformService {
    constructor(
        @InjectRepository(UNIFORM, 'gpreportConnection')
        private readonly uniform: Repository<UNIFORM>,
    ) {}

    findAll() {
        return this.uniform.find({
            relations: ['category'],
        });
    }
}
