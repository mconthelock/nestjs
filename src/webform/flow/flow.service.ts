import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';

import { Flow } from './entities/flow.entity';

@Injectable()
export class FlowService {
  constructor(
    @InjectRepository(Flow, 'amecConnection')
    private readonly flow: Repository<Flow>,
  ) {}
}
