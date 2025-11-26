import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { F110KP } from './entities/f110kp.entity';

@Injectable()
export class F110kpService {
  constructor(
    @InjectRepository(F110KP, 'amecConnection')
    private readonly f110kpRepository: Repository<F110KP>,
  ) {}
}
