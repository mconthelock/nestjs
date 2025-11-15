import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { IsWorkLoad } from './entities/allwork.entity';
import { IsWorkStatus } from './entities/workstatus.entity';
import { SearchWorkloadDto } from './dto/search.dto';

@Injectable()
export class IsWorkloadService {
  constructor(
    @InjectRepository(IsWorkLoad, 'docinvConnection')
    private readonly works: Repository<IsWorkLoad>,

    @InjectRepository(IsWorkStatus, 'docinvConnection')
    private readonly status: Repository<IsWorkStatus>,
  ) {}

  async searchWorkload(searchDto: SearchWorkloadDto) {
    return this.works.find({ where: { PLANYEAR: searchDto.PLANYEAR } });
  }

  async listStatus() {
    return this.status.find();
  }
}
