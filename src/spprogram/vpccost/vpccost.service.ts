import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateVpccostDto } from './dto/create-vpccost.dto';
import { UpdateVpccostDto } from './dto/update-vpccost.dto';

import { Vpccost } from 'src/common/Entities/datacenter/views/vpccost.entity';

@Injectable()
export class VpccostService {
    constructor(
        @InjectRepository(Vpccost, 'datacenterConnection')
        private readonly vpc: Repository<Vpccost>,
    ) {}

    async findAll() {
        return await this.vpc.find();
    }
}
